import {
  KS1_DECODER_KEY,
  KS1_DECODER_SERVICE,
} from '@/clients/grpc/grpc-connect/grpc-connect.component';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {AWSService} from '@/common/services/aws-s3.service';
import {CAKClient} from '@/servers/rest/cak.client';
import {log} from '@/utils';
import {retryFunction} from '@/utils/decorators';
import {bind, BindingScope, inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {Context} from 'vm';
import {CredentialConfig} from '../credential/credential-common.service';
import {DashboardTableCommonService} from '../dashboardTable/dashboardTable.common.service';
import {LateBindingCounterCommonService} from '../lateBindingCounters/lateBindingCounter.common.service';
import {QRMapping} from '../qrMapping/qrMapping.model';
import {ReportCommonService} from '../report/report.common.service';
import {
  ISerializationGroup,
  SerializationGroup,
  Status,
} from './serializationGroup.model';

@bind({scope: BindingScope.SINGLETON})
export class SerializationGroupCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('config.credential') private credentialConfig: CredentialConfig,
    @inject('services.LateBindingCounterCommonService')
    private lateBindingCounterCommonService: LateBindingCounterCommonService,
    @inject(KS1_DECODER_KEY)
    private ks1DecoderService: KS1_DECODER_SERVICE,
    @inject('services.DashboardTableCommonService')
    private dbTableCommonServ: DashboardTableCommonService,
    @inject('services.ReportCommonService')
    private reportCommonServ: ReportCommonService,
    @service(AWSService) private awsService: AWSService,
    @inject('services.CAKClient')
    private cakClient: CAKClient,
    @inject('ORG_ID') private orgId: string,
    @inject('env') private env: any,
  ) {
    super(ctx);
  }

  @authAndAuthZ('create', 'SerializationGroup')
  async createSerializationGroup({
    data,
  }: {
    data: Pick<ISerializationGroup, 'maxItems' | 'description'>;
  }) {
    log.debug(`createSerializationGroup init ==> `);
    const {serializationGroupCounter} =
      await this.lateBindingCounterCommonService.getSerializationGroupInc();
    // TODO ----------------------- replace with vlinderId----------------------------
    // const serializationGroupCounter = await (
    // 	await (
    // 		await this.vlinderIdGrpcService.getService()
    // 	).getSeqId({identifier: '2_2_2_batch'})
    // ).seqId;
    //---------------------------------------------
    const serializationGroup = await SerializationGroup.create({
      batchNo: serializationGroupCounter,
      status: Status.requested,
      ...data,
    });
    this.saveBatchQRCodes({
      batchNo: serializationGroup.batchNo.toString(),
      serialNoStart: 1,
      serialNoEnd: serializationGroup.maxItems,
    })
      .then(x => {
        log.info(`saving qrCodes init post serializationGroup creation`);
      })
      .catch(async err => {
        log.error(
          `error saving qrCodes post serializationGroup creation, ${err.message}`,
        );
        try {
          log.error(
            `error saving qrCodes post serializationGroup creation, ${err.message}`,
          );
          const newData = await SerializationGroup.findOneAndUpdate(
            {batchNo: serializationGroupCounter},
            {
              status: Status.failed,
            },
          );
        } catch (err: any) {
          log.error(
            `eror during updating failure status of saveBatchQRCodes. mag:  ${err.message}`,
          );
        }
      });
    log.debug(`createSerializationGroup: ${serializationGroup.batchNo}`);
    return serializationGroup;
  }

  @authAndAuthZ('create', 'SerializationGroup')
  async saveBatchQRCodes({
    batchNo,
    serialNoStart,
    serialNoEnd,
  }: {
    batchNo: string;
    serialNoStart: number;
    serialNoEnd: number;
  }) {
    const ret = await this.getQrHashes({
      batchNo,
      serialNoEnd,
      serialNoStart,
    });
    // save qr's into db if item_serialisation_with_voucher is true
    if (this.env?.ITEM_SERIALISATION_WITH_VOUCHER) {
      // add urlEncodedHash
      // const updatedHashes = ret.allHashes.map(
      //   (hashData: {hash: string | number | boolean}) => {
      //     hashData.hash =
      //       this.credentialConfig.ownBaseURL +
      //       '/product/' +
      //       encodeURIComponent(hashData.hash);
      //     return hashData;
      //   },
      // );
      await QRMapping.insertMany(ret.allHashes);
    }
    const qrCodes = ret.allHashes?.map(
      (x: {
        serialNo: {toString: () => string};
        hash: string;
        code: string;
      }) => ({
        serialNo: x.serialNo?.toString() as string,
        serializationGroup: batchNo,
        hash: x.hash as string,
        code: x.code as string,
      }),
    );
    const x = await this.saveAsCsv({qrCodes, batchNo});
  }

  @authAndAuthZ('read', 'SerializationGroup')
  async getSerializationGroup({
    serializationGroupId,
  }: {
    serializationGroupId: mongoose.Types.ObjectId;
  }) {
    log.debug(`getSerializationGroup init ==> ${serializationGroupId}`);

    const serializationGroup = await SerializationGroup.findOne({
      _id: serializationGroupId,
    });
    if (!serializationGroup)
      throw new HttpErrors.NotFound(
        `SerializationGroup not found for id :${serializationGroupId}`,
      );

    log.debug(`getSerializationGroup: ${serializationGroupId}`);
    return serializationGroup;
  }

  @authAndAuthZ('read', 'SerializationGroup')
  async getSerializationGroups() {
    log.debug(`getSerializationGroups init ==> `);

    const serializationGroup = await SerializationGroup.find({});

    log.debug(`getSerializationGroups: `);
    return serializationGroup;
  }

  @authAndAuthZ('read', 'SerializationGroup')
  async generateQRCodesForBatch({
    serializationGroupId,
  }: {
    serializationGroupId: mongoose.Types.ObjectId;
  }) {
    log.debug(
      `generateQRCodesForRange init ==> entityRangeId ${serializationGroupId}`,
    );

    const serializationGroup = await SerializationGroup.findOne({
      _id: serializationGroupId,
    });
    if (!serializationGroup)
      throw new HttpErrors.NotFound(
        `serializationGroup by Id ${serializationGroupId} not found`,
      );
    // -------------------------------------------------

    log.debug(
      `generateQRCodesForRange: finish ==> entityRangeId ${serializationGroupId}`,
    );
    const batchNo = serializationGroup.batchNo.toString();
    const ret = await this.getQrHashes({
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
    return {
      serializationGroup,
      qrCodes,
    };
  }

  @authAndAuthZ('read', 'SerializationGroup')
  @retryFunction
  public async getQrHashes({
    batchNo,
    serialNoEnd,
    serialNoStart,
  }: {
    batchNo: string;
    serialNoStart: number;
    serialNoEnd: number;
  }) {
    const input = {
      name: 'mercury',
      params: {
        org: this.orgId,
        batch: batchNo,
        item_serialisation_with_voucher:
          this.env?.ITEM_SERIALISATION_WITH_VOUCHER,
      },
      serialNoStart: serialNoStart,
      serialNoEnd: serialNoEnd,
      type: 'barcode',
    };
    console.log(input);

    log.info(
      `create qrCodes started for batch${batchNo} , total: ${
        serialNoEnd - serialNoStart + 1
      }, startNo:${serialNoStart}`,
    );
    const ret = this.cakClient.e2cak_serial_no_bulk(input);
    log.info(
      `create qrCodes Finished for batch${batchNo} , total: ${
        serialNoEnd - serialNoStart + 1
      }, startNo:${serialNoStart}`,
    );
    // --------------------------------------------------------
    return ret;
  }

  @authAndAuthZ('create', 'SerializationGroup')
  @retryFunction
  private async saveAsCsv({
    qrCodes,
    batchNo,
  }: {
    qrCodes: {serialNo: string; serializationGroup: string; hash: string}[];
    batchNo: string;
  }) {
    // create csv file in memory and upload to aws
    const uplodCSVResponse = await this.awsService.createCSVandUploadtoAws(
      qrCodes,
      'SerializationGroup',
      false,
    );
    // update csv link in serialization model
    const newData = await SerializationGroup.findOneAndUpdate(
      {batchNo: parseInt(batchNo)},
      {
        link: uplodCSVResponse.url,
        status: Status.available,
      },
    );
    return 'success';
  }

  @authAndAuthZ('read', 'SerializationGroup')
  async getMyCSVforBatch({
    serializationGroupId,
  }: {
    serializationGroupId: string;
  }) {
    const serializationGroup = await SerializationGroup.findOne({
      _id: serializationGroupId,
    });
    if (!serializationGroup)
      throw new HttpErrors.NotFound(
        `SerializationGroup not found for id :${serializationGroupId}`,
      );
    log.info(
      `getMyCSVforBatch successfully read from file, batchNo: ${serializationGroup.batchNo}`,
    );
    return {serializationGroup};
  }

  @authAndAuthZ('update', 'SerializationGroup')
  async retryCSVUpload({serializationGroupId}: {serializationGroupId: string}) {
    let serializationGroup = await SerializationGroup.findOne({
      _id: serializationGroupId,
    });
    if (!serializationGroup)
      throw new HttpErrors.NotFound(
        `SerializationGroup not found for id :${serializationGroupId}`,
      );
    // If link is there already throw validation error
    if (serializationGroup?.link)
      throw new HttpErrors.BadRequest(
        `CSV file already uploaded for requested serialization group`,
      );

    await this.saveBatchQRCodes({
      batchNo: serializationGroup.batchNo.toString(),
      serialNoStart: 1,
      serialNoEnd: serializationGroup.maxItems,
    });
    // return updated data
    serializationGroup = await SerializationGroup.findOne({
      _id: serializationGroupId,
    });
    log.info(
      `retryCSVUpload successfully uploaded csv file, batchNo: ${serializationGroup?.batchNo}`,
    );
    return serializationGroup;
  }
}
