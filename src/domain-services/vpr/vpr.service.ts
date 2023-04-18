/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {PowerpuffClient} from '@/clients/rest/powerpuff.client';
import {WalletClient} from '@/clients/rest/wallet.client';
import {authenticateMethod} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {log, pretty} from '@/utils';
import {bind, BindingScope, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  Brand,
  IOrgType,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import _ from 'lodash';
import {v4} from 'uuid';
import {Context} from 'vm';

// export type CreateMultipleSDRs = TempSDR & {emails: string[]};

export interface CreateSDRInput {
  bundleId: string;
  webhook?: string | null;
  nonce?: string | null;
  claims: SDRClaimInput[];
  emails: string[];
}

export interface SDRClaimInput {
  reason: string;
  credentialType: string;
  claimType?: string | null;
  claimValue?: string | null;
  essential: boolean;
  issuers?: {id?: string | null; url?: string | null}[] | null;
}

type Holder = {
  email: string;
  wallet: {did: string; pk: string};
  pushTokens: {token: string; user: string}[];
};

@bind({scope: BindingScope.SINGLETON})
export class VPRService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.MonarchaClient') private monarcha: MonarchaClient,
    @inject('services.PowerpuffClient')
    private powerpuffClient: PowerpuffClient,
    @inject('services.WalletClient') private walletClient: WalletClient,
  ) {
    super(ctx);
  }

  @authenticateMethod
  async createVPR(
    {emails, claims}: CreateSDRInput, // issuedByApp: Boolean = false, // app?: IApplication,
  ) {
    log.info(`create sdr init ${pretty({claims, emails})}`);

    const org = await Brand.findOne({orgType: IOrgType.NETWORK});
    if (!org || !org.did)
      throw new HttpErrors.NotFound(
        'network Organization or its did not found',
      );
    // const bundle = await\
    const tag = v4();
    const reqData = {
      data: {
        issuer: {
          id: org.did,
          profile: {
            name: org.name,
            type: 'organization',
            logo: org.logo as string,
            pk: org.pk as string,
            sameAs: org.sameAs as string,
            email: org.email as string,
            alias: org.name,
          },
        },
        tag,
        claims: claims,
      },
    };

    const {vpr} = await this.monarcha.createVPR(reqData);
    log.info(`vpr created for tag ${tag} ${pretty({claims, emails})} `);
    // console.log(ret);
    this.handleVPRTransport({emails, vpr, tag})
      .then()
      .catch(err => {
        log.error(`error while handling emails ${err.message}`);
      });
    // TODO handle transport
    return 'vpr created';
  }

  async handleVPRTransport({
    emails,
    vpr,
    tag,
  }: {
    emails: string[];
    vpr: string;
    tag: string;
  }) {
    const orgId = 3;
    const url = `https://klefki.io/${orgId}/${tag}`; //TODO

    const networkOrg = await Brand.findOne({orgType: IOrgType.NETWORK});
    if (!networkOrg || !networkOrg?.did)
      throw new HttpErrors.NotFound(
        'network organization or its did not found',
      );
    const client_id = networkOrg.did;

    const holders: Holder[] = await this.walletClient.getUsersByEmailOrDID({
      entries: emails,
      includePushTokens: true,
      client_id,
    });

    // console.log('holders =>', holders);
    if (_.isEmpty(holders)) return;

    const pushTokenList = holders
      ?.map(x => x.pushTokens)
      ?.flat(1)
      .filter(x => !!x);
    // console.log('pushTokenList =>', pushTokenList);
    const pushTokens = pushTokenList?.map(x => x.token).filter(x => !!x);
    console.log('pushTokens =>', pushTokens);
    const data = {
      name: pushTokens?.[0]?.toLowerCase().includes('expo')
        ? 'expo'
        : ('firebase' as 'expo' | 'firebase'),
      data: [
        {
          to: pushTokens,
          body: JSON.stringify({
            url,
          }),
          title: 'credential request',
        },
      ],
      uid: v4(),
    };

    // console.log('holders =>', holders);
    const ret = await this.powerpuffClient.pushNotificationNow({data});
    console.log(ret);
  }
}
