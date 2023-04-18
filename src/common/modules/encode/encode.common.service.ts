/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {ks1} from '@/../compiled';
import {
  KS1_DECODER_KEY,
  KS1_DECODER_SERVICE,
} from '@/clients/grpc/grpc-connect/grpc-connect.component';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {GeocoderService} from '@/common/services/geocoder.service';
import {CAKClient} from '@/servers/rest/cak.client';
import {CommonBindings} from '@common/request-context/common-bindings';
import {Context, inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import moment from 'moment';
import mongoose from 'mongoose';
import {CredentialConfig} from '../credential';
import {LateBindingCounterCommonService} from '../lateBindingCounters/lateBindingCounter.common.service';
import {EncodedLogs, IEncodedLogs} from './encodeLogs.model';

export class EncodeCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @service(GeocoderService) private geoCoder: GeocoderService,
    @inject(KS1_DECODER_KEY) private ks1DecoderServ: KS1_DECODER_SERVICE,
    @inject(CommonBindings.IP) private reqIp: string,
    @inject('services.LateBindingCounterCommonService')
    private LateBindingCounterCommonService: LateBindingCounterCommonService,
    @inject('services.CAKClient') private cakClient: CAKClient,
    @inject('config.credential') private credentialConfig: CredentialConfig,
  ) {
    super(ctx);
  }
  async createEncodeLog(args: {
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
    const {
      serializationGroupNo,
      entityRangeSlNo,
      appMode,
      hash,
      uid,
      latitude,
      longitude,
      env,
      ip,
      batchId,
      gtinId,
      interfaceType,
      isSuccess,
      failureMessage,
      serialIdentifier,
      NFCTagType,
    } = args;

    const {location} = await this.geoCoder.getLocationFromIPorGeoCoordts({
      latitude,
      longitude,
      ip: this.reqIp,
    });

    const val = await EncodedLogs.create({
      appMode,
      interfaceType,
      isSuccess,
      serialIdentifier,
      failureMessage,
      // serialNo: sNo,
      serializationGroupNo,
      entityRangeSlNo,
      // creatorEmail: accessUser?.email as string,
      // creatorUser: accessUser?._id,
      uid,
      location,
      ip,
      hash,
      env,
      NFCTagType,
      batchId,
      gtinId,
    });

    if (env === 'prod' && isSuccess === true) {
      // ---------------------------------------

      return val;
    }
    return val;
  }

  async getEncodeNFCTokenId({
    serializationGroupNo,
    uid,
    entityRangeSlNo,
    latitude,
    longitude,
    env = 'dev',
  }: {
    latitude?: number;
    longitude?: number;
    uid: string;
    serializationGroupNo: string;
    entityRangeSlNo: string;
    env?: 'dev' | 'prod';
  }) {
    const bNo = parseInt(serializationGroupNo);
    const rNo = parseInt(entityRangeSlNo);
    if (bNo <= 0 || rNo <= 0)
      throw new HttpErrors.BadRequest(
        'batchNo or RangeNo must be greater than 0',
      );

    // const serializationGroup = await SerializationGroup.findOne({batchNo: bNo});
    // if (!serializationGroup)
    //   throw new HttpErrors.NotFound(
    //     `serializationGroup not found for batchNo ${serializationGroupNo}`,
    //   );

    // if (rNo > serializationGroup.maxItems)
    //   throw new HttpErrors.BadRequest(
    //     `rangeSno cannot exceed maxitems in batch`,
    //   );

    const input: ks1.IKS1EncryptRequest = {
      version: 'v1',
      params: {
        org: '0', //this.coreConfig.networkKeys.org,  //TODO
        batch: serializationGroupNo,
        serialNo: entityRangeSlNo,
        nop: '0', //this.coreConfig.networkKeys.nop,
        vc: '0', //this.coreConfig.networkKeys.vc,
      },
      uid,
      type: 'nfc',
    };
    // console.log(this.ks1GrpcService);
    // --------------------------------------------------
    const serv = await this.ks1DecoderServ.getService();
    const ret = await serv.ks1Encrypt(input);
    return {
      hash: ret.hash,
      serializationGroupNo,
      entityRangeSlNo,
      uid,
      env,
    };
  }

  async getEncodeNFCForBatchId({
    uid,
    latitude,
    longitude,
    env = 'dev',
  }: {
    uid: string;
    latitude?: number;
    longitude?: number;
    env?: 'dev' | 'prod';
  }) {
    // create NFC hash
    const dateKey = moment().format('WWYY');
    const lateBindingCounterData =
      await this.LateBindingCounterCommonService.getBatchLazyBindingParent(
        dateKey,
      );

    const input: any = {
      name: 'mercury',
      params: {
        org: this.credentialConfig.externalId,
        shortDate: dateKey,
        parentId: lateBindingCounterData.counter.toString(),
      },
      uid: uid,
      type: 'nfc',
    };
    const ret = await this.cakClient.e2Cak(input);
    return {
      hash: (ret as any).hash,
      uid,
      env,
    };
  }
}
