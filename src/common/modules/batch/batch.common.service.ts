import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {log} from '@/utils';
import {bind, BindingScope, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import _ from 'lodash';
import mongoose from 'mongoose';
import {Context} from 'vm';
import {BatchLazyBindingParent} from '../batchLazyBindingParent/batchLazyBindingParent.model';
import {TableInput} from '../dashboardTable/dashboardTable.common.service';
import {EncodeCommonService} from '../encode/encode.common.service';
import {EncodedLogs, IEncodedLogs} from '../encode/encodeLogs.model';
import {batchAggregateBuilder} from './batch.aggregate.builder';
import {BatchAggregateHelper} from './batch.aggregate.helper';
import {BatchHelper} from './batch.common.helper';
import {Batch, IBatch} from './batch.model';

@bind({scope: BindingScope.SINGLETON})
export class BatchCommonService extends RequestCtxAbs {
  private batchHelper: BatchHelper;
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.EncodeCommonService')
    private encodeCommonService: EncodeCommonService,
  ) {
    super(ctx);
    this.batchHelper = new BatchHelper();
  }

  @authAndAuthZ('create', 'Batch')
  async uploadBatches({file}: {file: string}) {
    const currentUserId: string = (await this.getAccessUser())?.decodedJWT?.id;
    if (!currentUserId) {
      throw new HttpErrors.NotFound(`Current user id doesn't exists`);
    }
    return await this.batchHelper.uploadBatches(file, currentUserId);
  }

  @authAndAuthZ('create', 'Batch')
  async createBatch({
    data,
    where,
  }: {
    data: any;
    where: {productId: mongoose.Types.ObjectId};
  }) {
    log.debug(`Create batch init: `);
    const product = await Item.findOne({
      _id: where.productId || '',
    });
    if (!product)
      throw new HttpErrors.NotFound(
        `product not found for id ${where.productId}`,
      );

    if (data?.variants?.length) {
      const count = data.variants.length;
      const variantCount = await Variant.countDocuments({
        _id: {$in: data.variants},
      });
      if (count !== variantCount) {
        throw new HttpErrors.NotFound('Variants with given ids not found');
      }
    }
    // set logged-in userid
    const userDetails = await this.getAccessUser();
    data.creatorUser = userDetails.user?._id;
    const batch = await Batch.create({
      item: product._id,
      ...data,
    });
    log.debug(`Create batch finish: `);
    return batch;
  }

  @authAndAuthZ('read', 'Batch')
  async getBatch({batch_id}: {batch_id: mongoose.Types.ObjectId}) {
    const batch = await Batch.findById(batch_id);
    if (!batch) {
      throw new HttpErrors.NotFound('Batch not found');
    }
    return batch;
  }

  @authAndAuthZ('manage', 'Fuse')
  async createNFCHashForBatch({
    batchId,
    macId,
    latitude,
    longitude,
    env,
  }: {
    batchId: mongoose.Types.ObjectId;
    macId: string;
    latitude: number;
    longitude: number;
    env: 'dev' | 'prod';
  }) {
    // check batch present or not
    const batch = await Batch.findOne({
      _id: batchId,
    });
    if (!batch) {
      throw new HttpErrors.NotFound('Batch not found');
    }
    // check batchid in batch lazy binding parent
    const batchLazyBindingParent = await BatchLazyBindingParent.find({
      batch: batch?._id,
    });

    if (batchLazyBindingParent.length > 1) {
      throw new HttpErrors.BadRequest(
        'More than one batch lazy bindings found',
      );
    } else if (batchLazyBindingParent.length === 0) {
      throw new HttpErrors.NotFound('Batch lazy bindings not found');
    }
    // create NFC hash
    const res: any = await this.encodeCommonService.getEncodeNFCForBatchId({
      uid: macId,
      latitude: latitude,
      longitude: longitude,
      env: env,
    });
    res.serialIdentifier = batchLazyBindingParent[0]?._id;
    return res;
  }

  @authAndAuthZ('manage', 'Fuse')
  async updateNFCountForBatch({
    serialIdentifier,
    batchId,
    gtinId,
    uid,
    latitude,
    longitude,
    env,
    ip,
    hash,
    interfaceType,
    isSuccess,
    failureMessage,
    appMode,
    NFCTagType,
  }: {
    serialIdentifier: string;
    batchId: mongoose.Types.ObjectId;
    gtinId: mongoose.Types.ObjectId;
    uid: string;
    latitude: number;
    longitude: number;
    env: 'prod' | 'dev';
    ip: string;
    hash: string;
    interfaceType: 'barcode' | 'nfc';
    isSuccess: boolean;
    failureMessage?: string;
    appMode: 'mobile' | 'web';
    NFCTagType: IEncodedLogs['NFCTagType'];
    serializationGroupNo?: string;
    entityRangeSlNo?: string;
  }) {
    // find batch
    const batch = await Batch.findOne({
      _id: batchId,
      variants: gtinId,
    });
    if (!batch) {
      throw new HttpErrors.NotFound('Batch not found');
    }
    // find batch lazy binding parent
    const batchLazyBindingParent = await BatchLazyBindingParent.findOne({
      _id: serialIdentifier,
    });
    if (!batchLazyBindingParent) {
      throw new HttpErrors.NotFound('SerialIdentifier not found');
    }
    // create encoded log
    const encodeLog = this.encodeCommonService.createEncodeLog({
      serialIdentifier,
      batchId,
      gtinId,
      uid,
      latitude,
      longitude,
      env,
      ip,
      hash,
      interfaceType,
      isSuccess,
      failureMessage,
      appMode,
      NFCTagType,
    });
    return {success: true};
  }

  @authAndAuthZ('read', 'Batch')
  async getBatches({criteria, limit, skip, sort, sortOrder}: TableInput) {
    const gtin = await Variant.findOne({gtinKey: criteria.gtinKey});
    if (!gtin) {
      throw new HttpErrors.NotFound('Gtin not found');
    }
    criteria.gtinId = gtin._id;
    const ret = await new BatchAggregateHelper({
      criteria: criteria,
      skip: skip || 0,
      limit: limit || 10,
      sort: sort || '_id',
      sortOrder: sortOrder || 'desc',
    }).get();
    const rowData = ret.data?.map(async (x: any) => {
      // find the encoded logs
      const encodeLogs = await EncodedLogs.find({
        batchId: x?._id,
        gtinId: gtin?._id,
      });
      return {
        batchId: x?._id,
        batchNo: x?.name,
        gtinKey: criteria?.gtinKey,
        mfgDate: x?.manufactureDate,
        hash: x?.BatchLazyBindingParent?.hash,
        tagsFused: encodeLogs?.length,
      };
    });
    ret.data = rowData;
    return ret;
  }

  @authAndAuthZ('read', 'Batch')
  async findBatches({
    criteria,
    skip,
    limit,
    sort,
    sortOrder,
  }: {
    criteria: any;
    skip: number;
    limit: number;
    sort: string;
    sortOrder: string;
  }) {
    const batches = await batchAggregateBuilder({
      criteria,
      skip,
      limit,
      sort,
      sortOrder,
    });
    return batches;
  }

  @authAndAuthZ('update', 'Batch')
  async updateBatch({
    batch_id,
    data,
  }: {
    batch_id: mongoose.Types.ObjectId;
    data: Pick<IBatch, 'description' | 'isLocked'> & {
      validFrom: string;
      validUntil: string;
    };
  }) {
    const batch = await Batch.findById(batch_id);
    if (!batch) {
      throw new HttpErrors.NotFound('Batch not found');
    }
    const $set: any = {
      ...data,
      description: data.description,
      isLocked: data.isLocked,
    };
    if (data.validUntil) $set.shelfLife = data.validUntil;
    if (data.validFrom) $set.manufactureDate = data.validFrom;

    // No edit if batch is locked
    // TODO: uncommnent this when batch has isLocked field
    // if (batch.isLocked) {
    // throw new HttpErrors.BadRequest('Batch is locked');
    // }

    const updatedBatch = Batch.findOneAndUpdate(
      {
        _id: batch_id,
      },
      {
        $set,
      },
      {new: true},
    );
    return updatedBatch;
  }

  @authAndAuthZ('update', 'Batch')
  async attachGtinsToBatch({
    batchId,
    gtinIds,
  }: {
    batchId: string;
    gtinIds: mongoose.Types.ObjectId[];
  }) {
    const gtins = await Variant.find({
      _id: {$in: gtinIds},
    });
    const newVariantids = gtins.map((x: {_id: any}) => x._id);
    const batch = await Batch.findOneAndUpdate(
      {_id: batchId},
      {$addToSet: {variants: {$each: newVariantids}}},
      {new: true},
    );
    if (!batch)
      throw new HttpErrors.NotFound(
        `batch: ${batchId} not found or does not belong to your organization`,
      );

    return batch;
  }

  @authAndAuthZ('update', 'Batch')
  async attachManyBatchesToGtin({
    batchIds,
    gtinId,
  }: {
    batchIds: mongoose.Types.ObjectId[];
    gtinId: mongoose.Types.ObjectId;
  }) {
    log.debug(
      `attachManyBatchesToGtin init==> batchIds: ${batchIds}  gtinId: ${gtinId}`,
    );
    // if ((!batchId, gtinIds))
    const batches = await Batch.find({
      _id: {$in: batchIds},
    });
    const newBatchIds = batches.map(x => x._id.toString());
    batchIds.map(x => {
      if (!newBatchIds.includes(x.toString()))
        throw new HttpErrors.NotFound(
          `batch: ${x} not found or does not belong to your organization`,
        );
    });
    const gtin = await Variant.findOne({
      _id: gtinId,
    });
    if (!gtin) throw new HttpErrors.NotFound(`gtin by id ${gtinId} not found`);

    const sUpdated = await Batch.updateMany(
      {_id: {$in: batchIds}},
      {$addToSet: {variants: gtin._id}},
    );

    return gtin;
  }

  // @authAndAuthZ('read', 'Batch')
  async getBatchesForGtin({gtin, metadata}: {gtin: string; metadata: object}) {
    const gtinKey: string = gtin;
    log.debug(`getBatchesForGtin init==> ${gtin} ,  `);
    // if ((!batchId, gtinIds))
    const gtinData = await Variant.findOne({
      gtinKey,
    });
    if (!gtinKey) throw new HttpErrors.NotFound(`gtin ${gtinKey} not found`);

    const batches = await Batch.find({variants: gtinData?._id});

    log.debug(`getBatchesForGtin finish==> ${gtinKey} ,  `);

    return {
      data: {
        batches: batches.map(x =>
          _.pick(x, ['name', 'description', 'manufactureDate']),
        ),
      },
    };
  }
}
