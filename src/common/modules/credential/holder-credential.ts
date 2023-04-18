/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {CredentialTemplate} from '@/clients/rest/flinstone.client';
import {
  CreateCredentialRequest,
  MonarchaClient,
  VCredential,
} from '@/clients/rest/monarcha.client';
import {PowerpuffClient} from '@/clients/rest/powerpuff.client';
import {HolderFromDIDOrEmail, WalletClient} from '@/clients/rest/wallet.client';
import {AWSService} from '@/common/services/aws-s3.service';
import {log} from '@/utils/logging';
import {IBrand} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {v4 as uuidv4} from 'uuid';
import {CredentialViewService} from '.';
import {GetCredential} from '../../../clients/rest/monarcha.client';
import {
  CredentialCommonService,
  CredentialConfig,
} from './credential-common.service';
import {
  CredentialGeneric,
  VCredentialStatus,
} from './credential-generic.helper';

export interface KeyVal {
  key: string;
  value: string | string[];
}

export class HolderCredential extends CredentialGeneric {
  private holder: HolderFromDIDOrEmail;
  constructor(
    holder: HolderFromDIDOrEmail,
    walletClient: WalletClient,
    monarchaClient: MonarchaClient,
    credentialConfig: CredentialConfig,
    credentialViewService: CredentialViewService,
    powerPuffClient: PowerpuffClient,
    credCommonService: CredentialCommonService,
    credentialTemplate: CredentialTemplate | null,
    awsService: AWSService,
    issuerOrg: IBrand,
    credentialKeyVals: KeyVal[],
  ) {
    super(
      walletClient,
      monarchaClient,
      credentialConfig,
      credentialViewService,
      powerPuffClient,
      credCommonService,
      credentialTemplate,
      awsService,
      issuerOrg,
      credentialKeyVals,
    );
    this.holder = holder;
  }

  async issueCredential(sendEmail: boolean, sendPN: boolean) {
    log.info(
      `issue credential: from ${this.issuerOrg.name} to ${
        this.holder.email
      }, credTemp: ${(this.credentialTemplate as CredentialTemplate).name}`,
    );

    //get pdf and inject evidence

    if ((this.credentialTemplate as CredentialTemplate)?.pdf_template) {
      const {pdf} = await this.getPDF();
      if (pdf) {
        if (!(this.credentialTemplate as CredentialTemplate)?.inline_evidence) {
          const url = await this.uploadEvidenceDocument({pdf});
          this.credentialKeyVals.push({
            key: 'evidence',
            value: url as string,
          });
        } else {
          this.credentialKeyVals.push({
            key: 'evidence',
            value: pdf,
          });
        }
      }
    }

    const {extraVCParams, credSub, evidenceUrls} =
      CredentialGeneric.formatCredKeyVals(
        this.credentialKeyVals,
        (this.credentialTemplate as CredentialTemplate).name,
      );

    this.extraVCParams = extraVCParams;
    this.credSubject = credSub;
    this.evidenceUrls = evidenceUrls;

    const req: CreateCredentialRequest = {
      issuer: {
        id: this.issuerOrg.did as string,
        profile: {
          name: this.issuerOrg.name,
          type: 'organization',
          logo: this.issuerOrg.logo as string,
          pk: this.issuerOrg.pk as string,
          sameAs: this.issuerOrg.sameAs as string,
          email: this.issuerOrg.email as string,
          alias: this.issuerOrg.name,
        },
      },
      issuanceDate: this.extraVCParams.validFrom,
      expirationDate: this.extraVCParams.validUntil as string,
      credentialSubject: {
        id: this.holder?.wallet?.did ?? this.holder.email,
        alias: this.holder.email,
        ...credSub,
      },
      evidence: this.extraVCParams.evidence || [],
      credentialName: this.extraVCParams.credentialName,
      credentialTemplate:
        (this.credentialTemplate as CredentialTemplate).name ??
        (this.credentialTemplate as CredentialTemplate).id,
      credentialLogo:
        (this.credSubject['logo'] as string) ||
        ((this.credentialTemplate as CredentialTemplate).logo as string),
      credentialTag: this.extraVCParams.tag,
      externalId: this.credentialConfig.externalId,
    };

    // console.debug('holder =>', this.holder);
    // console.debug('req =>', req);
    const credential = await this.monarchaClient.createCredential(req);

    // create db entry
    await this.createCredentialDBEntry(credential);
    //register to data registry
    const status = this.holder?.wallet?.did
      ? VCredentialStatus.ISSUED
      : VCredentialStatus.PENDING;
    const cred = await this.registerToDataRegistry({credential, status});

    //initiate Transport
    this.initiateTransport({
      credential,
      credentialTemplate: this.credentialTemplate as CredentialTemplate,
      holder: this.holder,
      sendPN,
      sendEmail,
    }).catch(err => log.error('error in initiating transport'));

    return {cred};
  }

  async getPDF() {
    const previewCred = await this.getPreviewCredential();
    const {pdf} = await this.credentialViewService.getPDF({
      holder: this.holder,
      credential: previewCred,
      credentialTemplate: this.credentialTemplate as CredentialTemplate,
    });

    return {pdf};
  }

  async getPreviewCredential() {
    const {extraVCParams, credSub, evidenceUrls} =
      CredentialGeneric.formatCredKeyVals(
        this.credentialKeyVals,
        (this.credentialTemplate as CredentialTemplate).id,
      );

    this.extraVCParams = extraVCParams;
    this.credSubject = credSub;
    this.evidenceUrls = evidenceUrls;

    const cred: VCredential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: [
        'VerifiableCredential',
        (this.credentialTemplate as CredentialTemplate).name,
      ],
      id: `https://klefki.io/credentials/${this.credentialConfig.externalId}/${this.extraVCParams.tag}`,
      credentialStatus: {
        id: `https://klefki.io/status/${this.credentialConfig.externalId}/${this.extraVCParams.tag}`,
        type: 'CredentialStatusList2017',
      },
      credentialSubject: {
        id: this.holder?.wallet?.did ?? this.holder.email,
        alias: this.holder.email,
        ...this.credSubject,
      },
      issuanceDate: new Date().toISOString(),
      evidence: [],
      issuer: {
        id: this.issuerOrg?.did as string,
        profile: {
          name: this.issuerOrg.name,
          type: 'organization',
          logo: this.issuerOrg.logo,
          pk: this.issuerOrg.pk as string,
          email: this.issuerOrg.email as string,
          alias: this.issuerOrg.name,
        },
      },
      credentialLogo: this.issuerOrg.logo as string,
      credentialTag: this.extraVCParams.tag,
      credentialName: (this.credentialTemplate as CredentialTemplate).name,
    };

    return cred;
  }

  async transferPendingCredentials(sendEmail: boolean, sendPN: boolean) {
    // const creds = await this.monarchaClient.findCredential({
    //   did: this.issuerOrg?.did as string,
    //   query,
    // });

    // const ids = creds.map(
    //   cred =>
    //     `https://klefki.io/credentials/${this.credentialConfig.externalId}/${cred.tag}`,
    // );
    const credentials = (
      await this.monarchaClient.findCredential({
        where: [
          {
            column: 'subject',
            value: [this.holder.email],
            not: false,
            op: 'Equal',
          },
        ],
        order: [],
        take: 100,
        skip: 0,
      })
    ).credentials as GetCredential[];

    for (const credential of credentials) {
      const req: CreateCredentialRequest = {
        issuer: credential.verifiableCredential.issuer,
        issuanceDate: credential.verifiableCredential.issuanceDate,
        expirationDate: credential.verifiableCredential.expirationDate,
        credentialSubject: credential.verifiableCredential.credentialSubject,
        evidence: credential.verifiableCredential.evidence ?? [],
        credentialName:
          credential.verifiableCredential.credentialSubject['credentialName'],
        credentialTemplate: this.credentialTemplate?.name as string,
        credentialLogo:
          credential.verifiableCredential.credentialSubject['credentialLogo'],
        credentialTag:
          credential.verifiableCredential.id.split('/').pop() ?? uuidv4(),
        externalId: this.credentialConfig.externalId,
      };

      const c = await this.monarchaClient.createCredential(req);

      // create db entry
      await this.createCredentialDBEntry(c);
      //register to data registry
      const cred = await this.registerToDataRegistry({
        credential: c,
        status: VCredentialStatus.ISSUED,
      });

      //initiate Transport
      this.initiateTransport({
        credential: c,
        credentialTemplate: this.credentialTemplate as CredentialTemplate,
        holder: this.holder,
        sendPN,
        sendEmail,
      }).catch(err => log.error('error in initiating transport'));

      return {cred};
    }
  }
}
