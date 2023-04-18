import {ks1} from '@/../compiled';
import {
  KS1_DECODER_KEY,
  KS1_DECODER_SERVICE,
} from '@/clients/grpc/grpc-connect/grpc-connect.component';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {log, pretty} from '@/utils';
import {bind, BindingScope, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import mongoose from 'mongoose';
import {Context} from 'vm';
import {Batch} from '../batch';
import {DashboardTableCommonService} from '../dashboardTable/dashboardTable.common.service';
import {
  SerializationGroup,
  SerializationGroupCommonService,
} from '../serializationGroup';
import {EntityRange, IEntityRange} from './entityRange.model';

@bind({scope: BindingScope.SINGLETON})
export class EntityRangeCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject(KS1_DECODER_KEY)
    private ks1DecoderService: KS1_DECODER_SERVICE,
    @inject('services.SerializationGroupCommonService')
    private serializationGroupCommonService: SerializationGroupCommonService,
    @inject('services.DashboardTableCommonService')
    private dbTableCommonServ: DashboardTableCommonService,
  ) {
    super(ctx);
  }

  @authAndAuthZ('create', 'EntityRange')
  async createRangeFromQrCodes({
    startHash,
    endHash,
    productBatchId,
    gtinId,
    description,
  }: {
    startHash: string;
    endHash: string;
    productBatchId: mongoose.Types.ObjectId;
    gtinId: mongoose.Types.ObjectId;
    description: string;
  }) {
    const decodedstartHash = await (
      await this.ks1DecoderService.getService()
    ).ks1Decrypt({
      version: 'v1',
      hash: startHash,
      type: 'barcode',
    });
    const decodedEndHash = await (
      await this.ks1DecoderService.getService()
    ).ks1Decrypt({
      version: 'v1',
      hash: endHash,
      type: 'barcode',
    });

    if (decodedstartHash.decrypted?.status?.trim() !== '200') {
      log.warn(
        `scan returned non 200 status: pretty${decodedstartHash.decrypted}`,
      );
      throw new HttpErrors.BadRequest(`Invalid Input: status`);
    }
    // ------------------
    const formattedStartHash = this.getKs1DecryptValues(decodedstartHash);
    const formattedEndHash = this.getKs1DecryptValues(decodedEndHash);
    if (formattedStartHash.batchNo !== formattedEndHash.batchNo)
      throw new HttpErrors.BadRequest(
        `the two hashes does not belong to same Batch ,1stBatch ${formattedStartHash.batchNo},2ndBatch ${formattedEndHash.batchNo}`,
      );
    const serializationGroup = await SerializationGroup.findOne({
      batchNo: parseInt(formattedStartHash.batchNo as string),
    });
    if (!serializationGroup)
      throw new HttpErrors.NotFound(
        `serializationGroup by batchNo ${formattedStartHash.batchNo} not found`,
      );

    const ret = await this.createEntityRange({
      serializationGroupId: serializationGroup._id,
      productBatchId,
      gtinId,
      data: {
        description,
        upperBound: parseInt(formattedStartHash.serialNo as string),
        lowerBound: parseInt(formattedEndHash.serialNo as string),
      },
    });
    return ret;
  }

  @authAndAuthZ('create', 'EntityRange')
  async createEntityRange({
    data,
    serializationGroupId,
    productBatchId,
    gtinId,
  }: {
    data: Pick<IEntityRange, 'lowerBound' | 'description' | 'upperBound'>;
    serializationGroupId: mongoose.Types.ObjectId;
    productBatchId: mongoose.Types.ObjectId;
    gtinId: mongoose.Types.ObjectId;
  }) {
    log.debug(`createEntityRange init ==> `);
    const serializationGroup = await SerializationGroup.findOne({
      _id: serializationGroupId,
    });
    if (!serializationGroup)
      throw new HttpErrors.NotFound(
        `serializationGroup by Id ${serializationGroupId} not found`,
      );

    // TODO---------------------find conflict -------------------------
    if (data.lowerBound > data.upperBound)
      throw new HttpErrors.BadRequest(
        `lowerbound cannot be greater than upperbound serializationGroup Id ${serializationGroupId}`,
      );
    if (
      data.lowerBound > serializationGroup.maxItems ||
      data.upperBound > serializationGroup.maxItems
    )
      throw new HttpErrors.BadRequest(
        `bound cannot excced maxitems ${serializationGroup.maxItems} for serializationGroup Id ${serializationGroupId}`,
      );

    if (data.lowerBound <= 0 || data.upperBound <= 0)
      throw new HttpErrors.BadRequest(
        `bounds cannot have values less than 0  serializationGroupId:${serializationGroupId}`,
      );
    // -------------------------------------------------------------------------------------
    // TODO---------------------find inbetween conflict -------------------------
    // -------------------------------------------------------------------------------------
    const temp1 = await EntityRange.find({
      serializationGroup: serializationGroup._id,
      $or: [
        {
          lowerBound: {$lte: data.lowerBound},
          upperBound: {$gte: data.lowerBound},
        },
        {
          lowerBound: {$lte: data.upperBound},
          upperBound: {$gte: data.upperBound},
        },
        {lowerBound: {$gte: data.lowerBound, $lte: data.upperBound}},
        {upperBound: {$gte: data.lowerBound, $lte: data.upperBound}},
      ],
    }).countDocuments();
    if (temp1 > 0)
      throw new HttpErrors.BadRequest(`conflict with existing ranges`);

    const prodBatch = await Batch.findOne({_id: productBatchId});
    if (!prodBatch)
      throw new HttpErrors.NotFound(
        `prodBatch by Id ${productBatchId} not found`,
      );
    const gtin = await Variant.findOne({_id: gtinId});
    if (!gtin) throw new HttpErrors.NotFound(`gtin by Id ${gtinId} not found`);
    const product = await Item.findOne({_id: gtin.item});
    if (!product)
      throw new HttpErrors.NotFound(`product by Id ${gtin.item} not found`);

    const entityRange = await EntityRange.create({
      lowerBound: data.lowerBound,
      upperBound: data.upperBound,
      description: data.description || '',
      serializationGroup: serializationGroup._id,
      batch: prodBatch._id,
      variant: gtin._id,
      item: product._id,
    });

    // this.issueEntityRangeCredential({entityRangeId: entityRange._id})
    //   .then()
    //   .catch(err => {
    //     log.error(`error while issueEntityRangeCredential ==> ${err.message}`);
    //   });

    log.debug(
      `createEntityRange: finish ==> serializationGroupId ${serializationGroupId}`,
    );
    return entityRange;
  }

  // private async issueEntityRangeCredential({
  //   entityRangeId,
  // }: {
  //   entityRangeId: mongoose.Types.ObjectId;
  // }) {
  //   log.debug(`issueEntityRangeCredential init ==> entityRangeId ${entityRangeId}`);
  //   const entityRange = await EntityRange.findOne({_id: entityRangeId});
  //   if (!entityRange)
  //     throw new HttpErrors.NotFound(`entityRange by Id ${entityRangeId} not found`);

  //   // ------------------------------------

  //   const serializationGroup = await SerializationGroup.findOne({_id: entityRange.serializationGroup});
  //   if (!serializationGroup)
  //     throw new HttpErrors.NotFound(
  //       `serializationGroup by Id ${entityRange.serializationGroup} not found`,
  //     );
  //   const gtin = await Gtin.findOne({_id: entityRange.gtin});
  //   if (!gtin)
  //     throw new HttpErrors.NotFound(`gtin by Id ${entityRange.gtin} not found`);
  //   // -----------------------------------
  //   const product = await Product.findOne({_id: entityRange.product});
  //   if (!product)
  //     throw new HttpErrors.NotFound(
  //       `product by Id ${entityRange.product} not found`,
  //     );
  //   // ------------------------------
  //   const prodBatch = await Batch.findOne({_id: entityRange.batch});
  //   if (!prodBatch)
  //     throw new HttpErrors.NotFound(
  //       `prodBatch by Id ${entityRange.batch} not found`,
  //     );
  //   // -----------------------------------
  //   // TODO issueCreds
  //   // ----------------------------------------

  //   const tempStyle = await TemplateStyle.findOne({name: 'entityRange'});
  //   if (!tempStyle)
  //     throw new HttpErrors.NotFound(`tempStyle name: 'entityRange' not found`);

  //   //*  --------------ATTRS-----------------------------
  //   const credentialKeyVals: KeyVal[] = [
  //     {key: 'productName', value: product.name as string},
  //     {
  //       key: 'productDescription',
  //       value: product.description || ('' as string),
  //     },
  //     {key: 'gtin', value: gtin.gtinKey as string},
  //     {key: 'price', value: gtin.price as string},
  //     {key: 'quantityMetric', value: gtin.quantityMetric as string},
  //     {key: 'quantity', value: gtin.quantity as string},
  //     {key: 'batchName', value: prodBatch.name as string},
  //     {key: 'tokenGroup', value: serializationGroup.batchNo.toString() as string},
  //     // {key: 'tokenId', value: serializationGroup.batchNo.toString() as string},
  //     {key: 'tokenLB', value: entityRange.lowerBound.toString() as string},
  //     {key: 'tokenUB', value: entityRange.upperBound.toString() as string},
  //   ].filter(x => !!x.value);

  //   // ------------------------------------------------
  //   const inst = new IssueEntityRangeCredential(
  //     tempStyle,
  //     accessOrg,
  //     credentialKeyVals,
  //     this.formTemplateService,
  //     this.coreConfig,
  //     this.vcGrpcService,
  //     accessUser as IUser,
  //     gtin,
  //     product,
  //     prodBatch,
  //     entityRange,
  //     serializationGroup,
  //   );
  //   await inst.issueCred();
  //   // TODO issue individual creds
  //   // -----------------------------------
  //   // TODO aggregate function to verify all creds issued and proper
  //   // ----------------------------------------

  //   log.debug(`issueEntityRangeCredential: finish ==> entityRangeId ${entityRangeId}`);
  // }

  @authAndAuthZ('read', 'EntityRange')
  async getEntityRange({
    entityRangeId,
  }: {
    entityRangeId: mongoose.Types.ObjectId;
  }) {
    log.debug(`getEntityRange init ==> ${entityRangeId}`);

    const entityRange = await EntityRange.findOne({
      _id: entityRangeId,
    });
    if (!entityRange)
      throw new HttpErrors.NotFound(
        `EntityRange not found for id :${entityRangeId}`,
      );

    log.debug(`getEntityRange: ${entityRangeId}`);
    return entityRange;
  }

  @authAndAuthZ('read', 'EntityRange')
  async getEntityRanges({
    serializationGroupId,
  }: {
    serializationGroupId: mongoose.Types.ObjectId;
  }) {
    log.debug(`getRanges init ==> ${serializationGroupId}`);

    const serializationGroup = await SerializationGroup.findOne({
      _id: serializationGroupId,
    });
    if (!serializationGroup)
      throw new HttpErrors.NotFound(
        `SerializationGroup not found for id :${serializationGroupId}`,
      );
    const entityRanges = await EntityRange.find({
      serializationGroup: serializationGroup._id,
    });
    log.debug(`getRanges: ${serializationGroupId}`);
    return entityRanges;
  }

  @authAndAuthZ('read', 'EntityRange')
  async generateQRCodesForRange({
    entityRangeId,
  }: {
    entityRangeId: mongoose.Types.ObjectId;
  }) {
    log.debug(
      `generateQRCodesForRange init ==> entityRangeId ${entityRangeId}`,
    );

    const entityRange = await EntityRange.findOne({_id: entityRangeId});
    if (!entityRange)
      throw new HttpErrors.NotFound(
        `entityRange by Id ${entityRangeId} not found`,
      );
    // -----------------------------------
    const serializationGroup = await SerializationGroup.findOne({
      _id: entityRange.serializationGroup,
    });
    if (!serializationGroup)
      throw new HttpErrors.NotFound(
        `serializationGroup by Id ${entityRange.serializationGroup} not found`,
      );
    // -------------------------------------------------
    const batchNo = serializationGroup.batchNo.toString();
    const ret = await this.serializationGroupCommonService.getQrHashes({
      batchNo,
      serialNoEnd: serializationGroup.maxItems,
      serialNoStart: 1,
    });
    // console.log(ret);
    const qrCodes: {serialNo: string; batchNo: string; hash: string}[] =
      ret.map((x: {serialNo: {toString: () => string}; hash: string}) => ({
        serialNo: x.serialNo?.toString() as string,
        batchNo,
        hash: x.hash as string,
      }));

    log.debug(
      `generateQRCodesForRange: finish ==> entityRangeId ${entityRangeId}`,
    );
    return {
      entityRange,
      qrCodes,
    };
  }

  @authAndAuthZ('read', 'EntityRange')
  private getKs1DecryptValues(data: ks1.IKS1DecryptResponse) {
    const temp = {
      serialNo: data?.decoded?.elements?.find(x => x.title === 'SERIAL_NO')
        ?.value,
      batchNo: data?.decoded?.elements?.find(x => x.title === 'BATCH')?.value,
    };
    if (!temp.serialNo || !temp.batchNo)
      throw new HttpErrors.InternalServerError(
        `unable to get ks1 values  ${pretty(data)}`,
      );
    return temp;
  }
}
