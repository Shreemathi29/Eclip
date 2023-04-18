/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {
  CredentialTemplate,
  EmailData,
  FlinstoneClient,
  PDFData,
} from '@/clients/rest/flinstone.client';
import {VCredential} from '@/clients/rest/monarcha.client';
import {OrganizationService} from '@/domain-services';
import {fillTemplate, log} from '@/utils';
import {bind, BindingScope, config, inject, service} from '@loopback/core';
import {IBrand} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import _ from 'lodash';
import {
  HolderFromDIDOrEmail,
  WalletClient,
} from '../../../clients/rest/wallet.client';
import {
  CredentialAuthorizeState,
  CredentialConfig,
  CredentialState,
  CredentialStatus,
  CredentialType,
} from './credential-common.service';

export interface PrevieCred {
  status: CredentialStatus;
  logo: string | undefined;
  name: any;
  tag: string;
  from: string | undefined;
  to: string;
  iat: string;
  exp: any;
  authorize: CredentialAuthorizeState;
  type: CredentialType;
  state: CredentialState;
  templateId: string;
  signedVC: {
    jti: string;
    payload: {
      vc: {
        credentialSubject: any;
      };
      issuer: {
        legalName: string;
      };
      credentialStatus: {
        id: string;
      };
    };
  };
}
@bind({scope: BindingScope.SINGLETON})
export class CredentialViewService {
  constructor(
    @inject('config.mailConfig') private mailConfig: any,
    @service(WalletClient)
    private walletClient: WalletClient,
    @service(OrganizationService)
    private orgService: OrganizationService,
    @service(FlinstoneClient)
    private flinstoneClient: FlinstoneClient,
    @inject('config.credential') private credentialConfig: CredentialConfig,
    @config() public verifyViewConfig: any,
  ) {}

  async getEmail({
    holder,
    credential,
    credentialTemplate,
  }: {
    holder: HolderFromDIDOrEmail;
    credential: VCredential;
    credentialTemplate: CredentialTemplate;
  }) {
    const emailTemp =
      await this.flinstoneClient.getEmailPlaceHoldersForCredential(
        credentialTemplate.id,
      );
    const org = await this.orgService.getIssuerOrg();
    const ph = emailTemp.place_holders.concat(emailTemp.buttons);
    const dynamicData = this.getEmailDynamicData(credential, org);
    const placeholder_data = _.pick(dynamicData, ph);
    const emailData: EmailData = {
      logo: org.logo as string,
      recipient_name: holder.givenName ?? 'There',
      placeholder_data,
      sender: {
        issuer_org: org.name,
      },
    };
    const html = await this.flinstoneClient.generateHtml({
      id: emailTemp.id,
      data: emailData,
    });
    return {
      emailConfig: {
        from: this.mailConfig?.from,
        cc: this.mailConfig?.cc || [],
        subject: fillTemplate(emailTemp.subject, {org: org.name.split(' ')[0]}),
      },
      emailHtml: html,
    };
  }
  private getEmailDynamicData(credential: VCredential, org: IBrand) {
    const tag: string = credential.id.split('/').pop() ?? '';
    const data = {
      ...credential.credentialSubject,
      valid_from: credential?.issuanceDate,
      valid_until: credential?.expirationDate,
      credentialStatus: credential.credentialStatus.id,
      'Store in Klefki Wallet': this.getStoreCredentialButtonURL(tag),
      issuer_org: org.name,
      issuer_email: org.email,
    };
    return data;
  }

  async getPDF({
    holder,
    credential,
    credentialTemplate,
  }: {
    holder: HolderFromDIDOrEmail;
    credential: VCredential;
    credentialTemplate: CredentialTemplate;
  }) {
    const pdfTemp = await this.flinstoneClient.getPdfPlaceHolders(
      credentialTemplate.id,
    );
    const org = await this.orgService.getIssuerOrg();
    const ph = pdfTemp.place_holders;
    const dynamicData = this.getEmailDynamicData(credential, org);
    const placeholder_data = _.pick(dynamicData, ph);
    const pdfData: PDFData = {
      logo: org.logo as string,
      placeholder_data,
    };
    const pdf = await this.flinstoneClient.generatePDF({
      id: pdfTemp.id,
      data: pdfData,
    });
    return {pdf};
  }
  private getStoreCredentialButtonURL(tag: string) {
    const url = `${this.credentialConfig.storeURL}?tag=${tag}`;
    log.info(`formButtonURL in email body => ${url}`);
    return url;
  }
}
