/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {CAKClient} from '@/servers/rest/cak.client';
import {constants} from '@/utils/constants';
import {bind, BindingScope, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import moment from 'moment';
import {Context} from 'vm';
import {Batch} from '../batch/batch.model';
import {CredentialConfig} from '../credential';
import {LateBindingCounterCommonService} from '../lateBindingCounters/lateBindingCounter.common.service';
import {EventHistory} from '../misc/eventHistory.model';
import {User} from '../users/user.model';
import {BatchLazyBindingParent} from './batchLazyBindingParent.model';
@bind({scope: BindingScope.SINGLETON})
export class BatchLazyBindingParentCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('config.credential') private credentialConfig: CredentialConfig,
    @inject('services.LateBindingCounterCommonService')
    private LateBindingCounterCommonService: LateBindingCounterCommonService,
    @inject('services.CAKClient')
    private cakClient: CAKClient,
  ) {
    super(ctx);
  }
  @authAndAuthZ('create', 'BatchLazyBindingParent')
  async createBatchLazyBindingParent() {
    const dateKey = moment().format('WWYY');
    const lateBindingCounterData =
      await this.LateBindingCounterCommonService.getBatchLazyBindingParent(
        dateKey,
      );
    const cakClientRes = await this.cakClient.e2Cak({
      name: 'mercury',
      params: {
        org: this.credentialConfig.externalId,
        shortDate: dateKey,
        parentId: lateBindingCounterData.counter.toString(),
      },
      type: 'barcode',
    });
    const userDetails = await this.getAccessUser();
    //prepare data
    const batchLazyBindingParentData = {
      dateKey: dateKey,
      counterRef: lateBindingCounterData._id,
      parentId: lateBindingCounterData.counter,
      hash: cakClientRes.hash,
      createdBy: userDetails.user?._id,
      creatorRole: userDetails.role?.name,
      creatorType: 'User',
    };
    const batchLazyBindingParent = await BatchLazyBindingParent.create(
      batchLazyBindingParentData,
    );
    // add urlEncodedHash dynamically
    batchLazyBindingParent.urlEncodedHash =
      this.credentialConfig.ownBaseURL +
      '/product/' +
      encodeURIComponent(cakClientRes.hash);
    return batchLazyBindingParent;
  }

  @authAndAuthZ('create', 'BatchLazyBindingParent')
  async associateBatchLazyBindingParentWithProduct(reqData: any) {
    const batchLazyBindingParent = await BatchLazyBindingParent.findOne({
      _id: reqData.batchLazyBindingParentId,
    });

    if (!batchLazyBindingParent) {
      throw new HttpErrors.NotFound('BatchLazyBindingParent not found');
    }
    // find product
    const product = await Item.findById(reqData.associate.productId);
    if (!product) {
      throw new HttpErrors.NotFound(constants.MESSAGES.PRODUCT_NOT_FOUND);
    }
    // find varaint
    const gtin = await Variant.findById(reqData.associate.gtinId);
    if (!gtin)
      throw new HttpErrors.NotFound(constants.MESSAGES.VARIANT_NOT_FOUND);
    // find match of variant and batch
    const variantBatch = await Batch.findOne({
      variants: reqData.associate.gtinId,
      _id: reqData.associate.batchId,
    });
    if (!variantBatch)
      throw new HttpErrors.NotFound(constants.MESSAGES.BATCH_NOT_FOUND);
    // associate product, batch, gtin with batch lazy binding parent
    const dataToUpdate = {
      item: reqData.associate.productId,
      batch: reqData.associate.batchId,
      variant: reqData.associate.gtinId,
    };
    // before update record existing association in history for future audit
    await EventHistory.create({
      batchLazyBindingParentId: reqData.batchLazyBindingParentId,
      item: reqData.associate.productId,
      variant: reqData.associate.gtinId,
      batch: reqData.associate.batchId,
      createdBy: batchLazyBindingParent.createdBy,
      creatorType: 'User',
      eventType: 'BatchLBParentAssociation',
    });
    await BatchLazyBindingParent.findOneAndUpdate(
      {_id: reqData.batchLazyBindingParentId},
      dataToUpdate,
    );
    const updatedBatchLazyBindingParent = await BatchLazyBindingParent.findOne({
      _id: reqData.batchLazyBindingParentId,
    });
    return await this.customBatchLazyBindingParentResponse(
      updatedBatchLazyBindingParent,
    );
  }

  @authAndAuthZ('read', 'BatchLazyBindingParent')
  async getBatchLazyBindingParent(batchLazyBindingParentId: string) {
    const batchLazyBindingParent = await BatchLazyBindingParent.findOne({
      _id: batchLazyBindingParentId,
    });
    if (!batchLazyBindingParent) {
      throw new HttpErrors.NotFound('BatchLazyBindingParent not found');
    }
    return await this.customBatchLazyBindingParentResponse(
      batchLazyBindingParent,
    );
  }

  //  ----------------private methods --------------------
  private async customBatchLazyBindingParentResponse(
    batchLazyBindingParent: any,
  ) {
    // Find user data
    const user = await User.findOne({_id: batchLazyBindingParent.createdBy});
    let response = {
      _id: batchLazyBindingParent._id,
      description: batchLazyBindingParent.description,
      dateKey: batchLazyBindingParent.dateKey,
      counterRef: batchLazyBindingParent.counterRef,
      parentId: batchLazyBindingParent.parentId,
      hash: batchLazyBindingParent.hash,
      product: batchLazyBindingParent.item,
      gtin: batchLazyBindingParent.variant,
      batch: batchLazyBindingParent.batch,
      urlEncodedHash:
        this.credentialConfig.ownBaseURL +
        '/product/' +
        encodeURIComponent(batchLazyBindingParent.hash),
      createdBy: user?.email,
      creatorRole: batchLazyBindingParent.creatorRole,
      creatorType: batchLazyBindingParent.creatorType,
      createdAt: batchLazyBindingParent.createdAt,
      updatedAt: batchLazyBindingParent.createdAt,
    };
    return response;
  }
}
