/*


 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {DecodedJWTAndUser} from '@/common/request-context/decode-jwt.provider';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {DECODED_JWT_AND_USER} from '@common/request-context/common-bindings';
import {Context, inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Types} from 'mongoose';
import {v4} from 'uuid';
import {Application} from '../application/application.model';
import {ConsentMethod} from '../credential';
import {bundleAggregateBuilder} from './bundle.aggregate.builder';
import {Bundle} from './bundle.model';

export const DEFAULT_BUNDLE_LIMIT = 100;
export const DEFAULT_BUNDLE_SKIP = 0;
export class BundleCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject(DECODED_JWT_AND_USER) private currentUser: DecodedJWTAndUser,
    @service(MonarchaClient)
    private monarchaClient: MonarchaClient,
  ) {
    super(ctx);
  }

  @authAndAuthZ('create', 'Bundle')
  async createBundle(where: {applicationId: string}, data: any) {
    const bundle = await Bundle.create({
      ...data,
      bundle_id: v4(),
      creator: this.currentUser?.user?._id,
    });
    return bundle;
  }

  @authAndAuthZ('update', 'Application')
  async attachBundle({
    client_id,
    bundleIds,
  }: {
    client_id: string;
    bundleIds: Types.ObjectId[];
  }) {
    const bundles = await Bundle.find({_id: {$in: bundleIds}});
    const actualBundleIds = bundles.map(x => x._id);
    const app = await Application.findOneAndUpdate(
      {
        client_id,
      },
      {$addToSet: {bundles: actualBundleIds}},
      {new: true},
    );

    if (!app) {
      throw new HttpErrors.NotFound(
        `app with client_id: ${client_id} not found`,
      );
    }
    return 'Bundles attached to application.';
  }

  @authAndAuthZ('read', 'Bundle')
  async getBundlesById({_ids}: {_ids: string[]}) {
    const bundles = Bundle.find({_id: {$in: _ids}}).lean();
    return bundles;
  }

  @authAndAuthZ('read', 'Bundle')
  async getMyBundles(args?: {skip: number; limit: number}) {
    const ret = await bundleAggregateBuilder({
      criteria: {},
      skip: args?.skip,
      limit: args?.limit,
    });

    return ret;
  }

  @authAndAuthZ('read', 'Bundle')
  async getConsentMethods(args?: {skip: number; limit: number}) {
    return {consent_methods: Object.values(ConsentMethod)};
  }
}
