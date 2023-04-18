/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {
  CreateCredentialRequest,
  MonarchaClient,
} from '@/clients/rest/monarcha.client';
import {log} from '@/utils';
import {IBrand} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {uuid} from 'uuidv4';
import {CredentialConfig} from '../credential';
import {CredentialGeneric} from '../credential/credential-generic.helper';
import {CredTransaction, ICredTransaction} from '../credentialTransactions';
import {ITemplateStyle} from '../templateStyle';
import {IUser} from '../users/user.model';

export interface IIssuerIssueCredentialParams {
  credentialKeyVals: {key: string; value: string}[];
  credentialTemplateKey: string;
  batch?: string;
}

export interface ICredentialSubject {
  key: string;
  value: string | string[];
}

// @bind({scope: BindingScope.TRANSIENT})
export class IssueProvStepCred {
  private credSubject: {
    [key: string]: string | string[];
  };
  private extraVCParams: {
    credentialName: string;
    validFrom: string;
    tag: string;
    validUntil?: string | undefined;
    evidence?: any;
  };
  private evidenceUrls: string[] = [];
  private credtx: ICredTransaction;
  constructor(
    private tempStyle: ITemplateStyle,
    private issuerOrg: IBrand,
    private credentialKeyVals: {key: string; value: string | string[]}[],
    // private formTemplateService: FormTemplateService,
    private holderOrg: IBrand,
    // private coreConfig: CoreAndGatewayConfig,
    // private vcGrpcService: VCGrpcService,
    private issuerUser: IUser | null,
    // private credentialTemplate: CredentialTemplate,
    private monarchaClient: MonarchaClient,
    private credentialConfig: CredentialConfig,
    private saveCredToDb: boolean,
  ) {
    const {extraVCParams, credSub, evidenceUrls} =
      CredentialGeneric.formatCredKeyVals(
        this.credentialKeyVals,
        this.tempStyle.name,
      );

    this.extraVCParams = extraVCParams;
    this.credSubject = credSub;
    this.evidenceUrls = evidenceUrls;
  }

  async issueCred() {
    log.info(
      `ProvCred Init: to ${this.holderOrg.name} from ${this.issuerOrg.name} `,
    );

    const {reqObj} = await this.getRequestObj();
    const credential = await this.monarchaClient.createCredential(reqObj);
    console.log('credential ==>', credential);
    const tag = credential.id.split('/').pop() as string;
    if (this.saveCredToDb) await this.createCredTxDBEntry(tag); // todo
    return {result: 'success', credential: credential};
  }

  async createCredTxDBEntry(tag: string) {
    // const geoJSON =

    const credtx = await CredTransaction.create({
      credentialContent: {
        credentialSubject: this.credSubject,
        geoJSON: this.getGeoJSON(),
        evidences: this.evidenceUrls,
      },
      klefki_id: tag,
      isLocked: true,
      issuerUser: this.issuerUser?._id,
      credentialTemplate: this.tempStyle._id,
    });
    log.info(`ProvCred: credTx successfully created and save to db`);
    this.credtx = credtx;
    return {credtx};
  }

  private getGeoJSON() {
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
  private getRequestObj() {
    const logo = Array.isArray(this.credSubject['logo'])
      ? this.credSubject['logo']?.[0]
      : this.credSubject['logo'];
    const reqObj: CreateCredentialRequest = {
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
        id: this.holderOrg.did as string,
        alias: this.holderOrg.did as string,
        ...this.credSubject,
      },
      evidence: this.extraVCParams.evidence || [],
      credentialName: this.extraVCParams.credentialName,
      credentialTemplate: (this.tempStyle as ITemplateStyle).name,
      credentialLogo:
        logo || ((this.tempStyle as ITemplateStyle).logo as string),
      credentialTag: uuid(),
      externalId: this.credentialConfig.externalId,
    };

    return {reqObj};
  }
}
