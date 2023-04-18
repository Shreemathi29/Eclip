/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {RestClientConfig, RestClientService} from '@/clients/rest/rest.client';
import {EmailType} from '@/common/services';
import {bind, BindingScope, config} from '@loopback/context';
import {catchAxiosError} from './interceptor';

export interface CredentialTemplate {
  id: string;
  name: string;
  logo: string;
  description: string;
  inline_evidence: boolean;
  template: {
    label: string;
    name: string;
    type: string;
    fieldProps: unknown;
  }[];
  fields: unknown;
  pdf_template: string;
}
export interface EmailPlaceHolder {
  id: string;
  subject: string;
  buttons: string[];
  place_holders: string[];
}

export interface Org {
  name: string;
  id: string;
  description: string;
  logo: string;
  email: string;
  subscribedTemplates: string[];
}

export interface EmailData {
  logo: string;
  recipient_name: string; //holder or user name
  placeholder_data: {
    [k: string]: string; //otp, credential related data
  };
  sender: {
    issuer_org: string;
    issuer_name?: string;
    job_title?: string;
    website?: string;
    meta?: string; //append in regards
  };
}

export type PDFData = Pick<EmailData, 'logo' | 'placeholder_data'>;
export type PDFPlaceHolder = Pick<EmailPlaceHolder, 'id' | 'place_holders'>;
@bind({scope: BindingScope.SINGLETON})
export class FlinstoneClient {
  constructor(
    @config() private flinstoneConfig: RestClientConfig,
    private restClient = new RestClientService(flinstoneConfig.httpTimeout),
  ) {}

  //credential-template

  @catchAxiosError
  async getCredentialTemplateByID(id: string) {
    const ret = await this.restClient.post(
      this.getFullUrl(`/org/credential-template/get-by-id/${id}`),
      {org_id: this.flinstoneConfig.orgId},
    );
    return ret.data.credential_template;
  }

  @catchAxiosError
  async getCredentialTemplates({
    skip = 0,
    limit = 100,
  }: {
    skip: number;
    limit: number;
  }) {
    const ret = await this.restClient.post(
      this.getFullUrl(`/org/get/credential-templates`),
      {
        org_id: this.flinstoneConfig.orgId,
        skip,
        limit,
      },
    );
    return ret.data.templates;
  }

  @catchAxiosError
  async getCredentialTemplateByName(name: string) {
    const ret = await this.restClient.post(
      this.getFullUrl(`/org/credential-template/get-by-name/${name}`),
      {org_id: this.flinstoneConfig.orgId},
    );
    return ret.data.credential_template;
  }
  //self-declaration

  @catchAxiosError
  async getSelfDeclarationsByIds({uids}: {uids: string[]}) {
    const ret = await this.restClient.post(
      this.getFullUrl(`/self-declarations/get-by-uids`),
      {
        uids,
      },
    );
    return ret.data.mini_apps;
  }
  @catchAxiosError
  async getEmailPlaceHolders(type: EmailType): Promise<EmailPlaceHolder> {
    const ret = await this.restClient.post(
      this.getFullUrl(`/org/get/email/place-holders/${type}`),
      {
        org_id: this.flinstoneConfig.orgId,
      },
    );
    return ret.data?.email_template;
  }

  @catchAxiosError
  async generateHtml({id, data}: {id: string; data: EmailData}) {
    const ret = await this.restClient.post(
      this.getFullUrl(`/org/email/generate/html`),
      {
        org_id: this.flinstoneConfig.orgId,
        id,
        data,
      },
    );
    return ret.data?.html;
  }

  @catchAxiosError
  async getEmailPlaceHoldersForCredential(
    credTempId: string,
  ): Promise<EmailPlaceHolder> {
    const ret = await this.restClient.post(
      this.getFullUrl(
        `/org/get/credential-template/email/place-holders/${credTempId}`,
      ),
      {
        org_id: this.flinstoneConfig.orgId,
      },
    );
    return ret.data?.email_template;
  }

  @catchAxiosError
  async getPdfPlaceHolders(credTempId: string): Promise<PDFPlaceHolder> {
    const ret = await this.restClient.post(
      this.getFullUrl(
        `/org/get/credential-template/pdf/place-holders/${credTempId}`,
      ),
      {
        org_id: this.flinstoneConfig.orgId,
      },
    );
    return ret.data?.pdf_template;
  }

  @catchAxiosError
  async generatePDF({id, data}: {id: string; data: PDFData}) {
    const ret = await this.restClient.post(
      this.getFullUrl(`/org/email/generate/pdf`),
      {
        org_id: this.flinstoneConfig.orgId,
        id,
        data,
      },
    );
    return ret.data?.pdf;
  }

  // ------------------------------------private----------------------------------

  private getFullUrl(route: string) {
    const baseURL = this.flinstoneConfig.baseUrl;
    return baseURL + route;
  }
}
