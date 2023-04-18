/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {WalletClient} from '@/clients/rest/wallet.client';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {bind, BindingScope, inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {
  Brand,
  IOrgType,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {Context} from 'vm';
import {CredentialType} from '../credential';
import {GraphGeneratorService, VC} from './graph-generator.helper';

export interface GetMyGraphInput {
  criteria: any;
  skip: number;
  limit: number;
  sort: string;
  sortOrder: string;
}

@bind({scope: BindingScope.SINGLETON})
export class NetworkGraphCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.MonarchaClient') private monarcha: MonarchaClient,
    @inject('services.WalletClient') private walletClient: WalletClient,
  ) {
    super(ctx);
  }

  @authAndAuthZ('read', 'Credential')
  async getMyGraph(args: {query: GetMyGraphInput}) {
    const input = args.query || {};
    const org = await this.getOrg();
    const ret = await this.getCredentials(input);

    const users = await this.walletClient.getUsersByEmailOrDID({
      client_id: org?.did as string,
      entries: ret.credentials
        .map(x => x.verifiableCredential?.credentialSubject.id as string)
        .filter(x => !!x),
    });
    // console.log('credentials', credentials);
    const graph = await new GraphGeneratorService({
      credentials: ret.credentials,
      org: org,
      users: users as any[],
      actualEdgecount: ret.totalCount,
    }).generate();
    return {
      ...graph,
      currentPage: ret.currentPage,
      pageSize: ret.pageSize,
      totalCount: ret.totalCount,
      totalPages: ret.totalPages,
    };
  }

  // ----------------------private methods ------------------------------------
  private async getOrg() {
    const org = await Brand.findOne({orgType: IOrgType.NETWORK});
    // console.log('org', org);
    if (!org || !org.did)
      throw new HttpErrors.NotFound('organization or did not found');
    return org;
  }

  private async getCredentials(input: GetMyGraphInput) {
    const type =
      (input?.criteria?.type as CredentialType) ===
      CredentialType.VERIFIABLE_PRESENTATION
        ? 'verifiablePresentation'
        : 'verifiableCredential';
    console.log('skip,limit', input);
    const vcs = (await this.monarcha.findCredential({
      skip: input.skip || 0,
      take: input.limit || 20,
      where: [
        // {
        //   column: 'type',
        //   value: [type],
        //   op: 'Equal',
        // },
      ],
      order: [
        {
          column: 'issuanceDate',
          direction: 'DESC',
        },
      ],
    })) as {
      credentials: VC[];
      currentPage: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    };
    return vcs;
  }
}
