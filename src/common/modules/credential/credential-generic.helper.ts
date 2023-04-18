/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {CredentialTemplate} from '@/clients/rest/flinstone.client';
import {MonarchaClient, VCredential} from '@/clients/rest/monarcha.client';
import {PowerpuffClient} from '@/clients/rest/powerpuff.client';
import {AWSService} from '@/common/services/aws-s3.service';
import {service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {IBrand} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import moment from 'moment';
import {uuid} from 'uuidv4';
import {CredentialViewService, TransportService} from '.';
import {
  CredentialToRegister,
  HolderFromDIDOrEmail,
  WalletClient,
} from '../../../clients/rest/wallet.client';
import {
  CredentialCommonService,
  CredentialConfig,
} from './credential-common.service';

export enum VCredentialStatus {
  PENDING = 'pending',
  ISSUED = 'issued',
  ACTIVE = 'active',
  REVOKED = 'revoked',
  DISPUTED = 'disputed',
  TRANSFERRED = 'transferred',
}

export class CredentialGeneric {
  protected credSubject: {
    [key: string]: string | string[];
  };

  protected extraVCParams: {
    credentialName: string;
    validFrom: string;
    tag: string;
    validUntil?: string | undefined;
    evidence?: any;
  };
  protected evidenceUrls: string[] = [];

  constructor(
    @service(WalletClient)
    protected walletClient: WalletClient,
    @service(MonarchaClient)
    protected monarchaClient: MonarchaClient,
    protected credentialConfig: CredentialConfig,
    @service(CredentialViewService)
    protected credentialViewService: CredentialViewService,
    @service(PowerpuffClient)
    protected powerPuff: PowerpuffClient,
    protected credCommonService: CredentialCommonService,
    protected credentialTemplate: CredentialTemplate | null,
    protected awsService: AWSService,
    protected issuerOrg: IBrand,
    protected credentialKeyVals: {key: string; value: string | string[]}[],
  ) {}

  static formatCredKeyVals(
    credentialKeyVals: {key: string; value: string | string[]}[],
    templateKey: string,
  ) {
    const credSub: {[key: string]: string | string[]} = {};
    const optValues: {
      validUntil?: string;
      evidence?: any;
    } = {};
    let validFrom: string | undefined = undefined;
    const credentialName =
      (credentialKeyVals.find(x => x.key === 'credentialName')
        ?.value as string) ?? templateKey;
    const evidenceUrls: string[] = [];
    const evidencesObjects: any[] = [];
    const logos: string[] = [];

    credentialKeyVals.forEach(x => {
      if (x.key.includes('.'))
        throw new HttpErrors.BadRequest(
          `Keys must not contain period ".", key: ${x.key} `,
        );
      switch (x.key) {
        case 'validFrom':
          validFrom = moment(x.value).format();
          break;
        case 'validUntil':
          optValues.validUntil = moment(x.value).format();
          break;
        case 'evidence':
          evidencesObjects.push({
            id: x.value,
            evidenceDocument: credentialName,
            type: ['DocumentVerification'],
            subjectPresence: 'Digital',
            documentPresence: 'Digital',
          });
          evidenceUrls.push(x.value as string);
          break;
        case 'logo':
          logos.push(x.value as string);
          break;
        default:
          credSub[x.key] = x.value;
          break;
      }
    });

    credSub.credentialName = credentialName;
    if (logos.length === 1) credSub['logo'] = logos[0];
    if (logos.length > 1) credSub['logo'] = logos;
    if (evidencesObjects.length >= 1) optValues.evidence = evidencesObjects; //JSON.stringify(evidencesObjects[0]);

    const extraVCParams = {
      ...optValues,
      credentialName: credentialName,
      validFrom: validFrom ?? moment().format(),
      tag: uuid(),
    };

    return {credSub, extraVCParams, evidenceUrls};
  }

  protected async createCredentialDBEntry(credential: VCredential) {
    await this.credCommonService.createCredential(
      credential,
      this.credentialTemplate as CredentialTemplate,
    );
  }
  protected async registerToDataRegistry({
    credential,
    status,
  }: {
    credential: VCredential;
    status: VCredentialStatus;
  }) {
    const cred: CredentialToRegister = {
      from: credential.issuer.id,
      to: credential.credentialSubject.id,
      tag: credential.id.split('/').pop() as string,
      valid_from: credential.issuanceDate,
      valid_until: credential.expirationDate,
      holder_bkup: JSON.stringify(credential.credentialSubject),
      issuer_bkup: '',
      status,
    };
    await this.walletClient.registerCredential({
      did: this.issuerOrg.did as string,
      credential: cred,
    });
    return cred;
  }

  protected getGeoJSON() {
    try {
      return (
        this.credSubject?.geoJSON &&
        typeof this.credSubject?.geoJSON === 'string' &&
        JSON.parse(this.credSubject?.geoJSON)
      );
    } catch (err) {
      return undefined;
    }
  }

  protected async initiateTransport({
    credential,
    credentialTemplate,
    holder,
    sendPN,
    sendEmail,
  }: {
    credential: VCredential;
    credentialTemplate: CredentialTemplate;
    holder: HolderFromDIDOrEmail;
    sendPN: boolean;
    sendEmail: boolean;
  }) {
    const transpInst = new TransportService(
      {
        tag: credential.id.split('/').pop() as string,
        holder,
        issuerOrg: this.issuerOrg,
        sendPN: sendPN,
        sendEmail: sendEmail,
      },
      this.credentialConfig,
      this.walletClient,
      this.powerPuff,
    );
    if (sendEmail) {
      const {emailConfig, emailHtml} =
        await this.credentialViewService.getEmail({
          holder,
          credential,
          credentialTemplate,
        });
      let pdf: string | undefined = undefined;
      if (credentialTemplate?.pdf_template) {
        const res = await this.credentialViewService.getPDF({
          holder,
          credential,
          credentialTemplate,
        });
        pdf = res?.pdf;
      }

      transpInst.addEmail({
        from: emailConfig?.from,
        cc: emailConfig?.cc,
        fileNameWithoutExt: 'credential',
        html: emailHtml as string,
        pdf: pdf,
        subject: emailConfig?.subject,
      });
      transpInst.initiateTransportSync();
    }
  }

  async uploadEvidenceDocument({pdf}: {pdf: string}) {
    const {ownBaseURL, externalId, evidenceBucket, evidenceRoute} =
      this.credentialConfig;
    const ret = await this.awsService.uploadFile({
      data: pdf,
      encoding: 'base64',
      bucket: this.credentialConfig.evidenceBucket,
      mimeType: 'application/pdf',
    });
    if (ret?.url) {
      const url = `${ownBaseURL}/${evidenceRoute}/${externalId}/${evidenceBucket}/${ret?.key}`;
      return url;
    }
    return undefined;
  }
  async getEvidenceDocument({bucket, key}: {bucket: string; key: string}) {
    return this.awsService.getFile({key, bucket});
  }
}
