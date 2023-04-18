/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {RestClientConfig, RestClientService} from '@/clients/rest/rest.client';
import {VC} from '@/common/modules/networkGraph/graph-generator.helper';
import {addCache} from '@/common/services/cache.service';
import {GlobalBindingKeys} from '@/utils/binding-keys';
import {config, Context, inject} from '@loopback/context';
import {bind, BindingScope} from '@loopback/core';
import {catchAxiosError} from './interceptor';

export enum CredentialType {
  VERIFIABLE_CREDENTIAL = 'VerifiableCredential',
  VPR = 'VPR',
  VERIFIABLE_PRESENTATION = 'VerifiablePresentation',
}
export interface IssuerProfile {
  id?: string;
  name: string;
  type: 'organization' | 'thing' | 'app' | 'person';
  logo?: string;
  image?: string;
  pk: string;
  sameAs?: string;
  email?: string;
  alias: string;
}

export interface Issuer {
  id: string;
  profile: IssuerProfile;
}
export interface Evidence {
  id: string;
  evidenceDocument: string;
  type: string[];
  subjectPresence: string;
  documentPresence: string;
}

export interface CreateCredentialRequest {
  issuer: Issuer;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  evidence?: Evidence[];
  credentialName: string;
  credentialTemplate: string;
  credentialLogo: string;
  credentialTag: string;
  externalId: string;
}

export interface CredentialSubject {
  id: string;
  alias: string;
  [key: string]: string;
}

export interface CredentialStatus {
  id: string;
  type: string;
}

export interface VCredential {
  '@context': string[];
  type: string[];
  id: string;
  credentialStatus: CredentialStatus;
  credentialSubject: CredentialSubject;
  issuanceDate: string;
  evidence?: Evidence[];
  expirationDate?: string;
  issuer: Issuer;
  proof?: Proof;
  credentialName: string;
  credentialLogo: string;
  credentialTag: string;
}
export interface Proof {
  type: string;
  jwt: string;
}

export interface Credentials {
  client_id: string;
  secret: string;
  exp?: string;
}
export interface IdentityRequest {
  provider: string;
  alias: string;
}

export interface VerifyIdentityRequest {
  client_id: string;
  access_token: string;
}

export interface DecodeIdentityRequest {
  access_token: string;
}

export interface Identity {
  provider: string;
  alias: string;
  did: string;
  publicKeyHex: string;
  privateKeyHex?: string;
  type?: string;
}

export interface Error {
  error_type: string;
  error_code: string;
  error_message: string;
  display_message: string;
}
export interface GetCredentialRequest {
  id: string;
  externalId: string;
}

export interface GetCredential {
  hash: string;
  verifiableCredential: VCredential;
}

export interface FindCredentialRes {
  credentials: GetCredential[] | VC[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface VerifyCredentialRequest extends GetCredentialRequest {}

export interface Claim {
  id: string;
  currentStatus: string;
  statusReason: string;
}

export interface GetCredentialStatus {
  tag: string;
  id: string;
  description: string;
  verifiableCredential: {
    claim: Claim;
    issuer: Issuer;
    proof: Proof;
    issued: Date;
  }[];
}

export interface CredentialStatusResponse {
  credentialStatus: GetCredentialStatus;
  request_id: string;
}

export interface Where {
  column: string;
  value: string[];
  not?: boolean;
  op: string;
}

export interface Order {
  column: string;
  direction: string;
}

export interface FindCredentialQuery {
  where: Where[];
  order?: Order[];
  take?: number;
  skip?: number;
}

export interface DecodeHeader {
  typ: string;
  alg: string;
}

export interface DecodePayload {
  iat: number;
  exp: number;
  iss: string;
}

export interface DecodedIdentity {
  header: DecodeHeader;
  payload: DecodePayload;
  signature: string;
  data: string;
}

@bind({scope: BindingScope.SINGLETON})
export class MonarchaClient {
  constructor(
    @inject.context() private ctx: Context,
    @inject(GlobalBindingKeys.CACHE_CONFIG) private cacheConfig: any,
    @config() private monarchaConfig: RestClientConfig,
    private restClient = new RestClientService(monarchaConfig.httpTimeout),
  ) {}

  @catchAxiosError
  async createCredential(req: CreateCredentialRequest): Promise<VCredential> {
    const response = await this.restClient.post(
      this.getFullUrl(`/credential/create`),
      req,
    );
    return response?.data?.credential;
  }

  @catchAxiosError
  async getCredential(req: GetCredentialRequest): Promise<GetCredential> {
    const response = await this.restClient.post(
      this.getFullUrl(`/credential/get`),
      req,
    );
    return response?.data?.credential;
  }

  @catchAxiosError
  @addCache('id')
  async verifyCredential(req: VerifyCredentialRequest) {
    const response = await this.restClient.post(
      this.getFullUrl(`/credential/verify`),
      req,
    );
    return response?.data?.credential;
  }

  @catchAxiosError
  async findCredential(req: FindCredentialQuery): Promise<FindCredentialRes> {
    const response = await this.restClient.post(
      this.getFullUrl(`/credential/find`),
      req,
    );
    return response?.data;
  }

  @catchAxiosError
  async createIdentity(req: IdentityRequest): Promise<Identity> {
    const response = await this.restClient.post(
      this.getFullUrl(`/identity/create`),
      req,
    );
    return response?.data?.identity;
  }
  @catchAxiosError
  async getIdentity(req: IdentityRequest): Promise<Identity> {
    const response = await this.restClient.post(
      this.getFullUrl(`/identity/get`),
      req,
    );
    return response?.data?.identity;
  }

  @catchAxiosError
  async decodeIdentity(req: DecodeIdentityRequest): Promise<DecodedIdentity> {
    const response = await this.restClient.post(
      this.getFullUrl(`/identity/decode`),
      req,
    );
    return response?.data?.identity;
  }

  @catchAxiosError
  async getSecret(req: IdentityRequest): Promise<Identity> {
    const response = await this.restClient.post(
      this.getFullUrl(`/identity/secret/get`),
      req,
    );
    return response?.data?.identity?.privateKeyHex;
  }

  @catchAxiosError
  async verifyIdentity(req: VerifyIdentityRequest): Promise<Identity> {
    const response = await this.restClient.post(
      this.getFullUrl(`/identity/verify`),
      req,
    );
    return response?.data?.identity;
  }

  @catchAxiosError
  async createVPR(req: any): Promise<any> {
    const response = await this.restClient.post(
      this.getFullUrl(`/vpr/create`),
      req,
    );
    return response?.data;
  }

  @catchAxiosError
  async updateCredentialStatus(req: {
    id: string;
    externalId: string;
    status: string;
    reason: string;
  }) {
    const response = await this.restClient.post(
      this.getFullUrl(`/credential/status/update`),
      req,
    );
    return response?.data;
  }

  @catchAxiosError
  async getCredentialStatus(req: {
    id: string;
  }): Promise<CredentialStatusResponse> {
    const response = await this.restClient.post(
      this.getFullUrl(`/credential/status/get`),
      req,
    );
    return response?.data;
  }

  @catchAxiosError
  async getAccessToken(req: Credentials) {
    const response = await this.restClient.post(
      this.getFullUrl(`/common/access-token/get`),
      req,
    );
    return response?.data;
  }

  private getFullUrl(route: string) {
    // TODO: remove this hard coded url before merge
    const baseURL = this.monarchaConfig.baseUrl; //todo
    return baseURL + route;
  }
}
