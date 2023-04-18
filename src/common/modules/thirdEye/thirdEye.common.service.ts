/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {AWSService} from '@/common/services/aws-s3.service';
import {log} from '@/utils';
import {bind, BindingScope, inject} from '@loopback/context';
import {service} from '@loopback/core';
import moment from 'moment';
import {nanoid} from 'nanoid';
import {Context} from 'vm';
import {ThirdEyeLog} from './thirdEyeLogs.model';

@bind({scope: BindingScope.SINGLETON})
export class ThirdEyeCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('env') private env: any,
    @service(AWSService) private aswService: AWSService,
  ) {
    super(ctx);
  }

  async thirdEyeUpload(params: {
    fssaiImg: string;
    mfgImg: string;
    data: any;
    userProfile: any;
  }) {
    const dateString = moment().utcOffset('+05:30').format(`DD_MM_YY-HH_mm_`);
    const id = dateString + nanoid();

    const mainKey =
      (params?.userProfile?.email as string)?.replace(/[^a-zA-Z0-9 ]/g, '') ||
      'others';
    const fssaiFileName = `${mainKey}/${id}/fssai.jpeg`;
    const mfgFileName = `${mainKey}/${id}/mfg.jpeg`;
    const JsonFileName = `${mainKey}/${id}/data.json`;
    let fssaiUrl: undefined | string = undefined;
    if (params?.fssaiImg) {
      const {url} = await this.aswService.uploadFile({
        data: params.fssaiImg,
        encoding: 'base64',
        dontPrependId: true,
        // ACL: 'private',
        bucket: this.env.AWS_S3_BUCKET_NAME,
        fileName: fssaiFileName,
        mimeType: 'image/jpeg',
      });
      fssaiUrl = url;
    }

    let mfgUrl: undefined | string = undefined;
    if (params?.mfgImg) {
      const {url} = await this.aswService.uploadFile({
        data: params.mfgImg,
        encoding: 'base64',
        dontPrependId: true,
        // ACL: 'private',
        bucket: this.env.AWS_S3_BUCKET_NAME,
        mimeType: 'image/jpeg',
        fileName: mfgFileName,
      });
      mfgUrl = url;
    }
    const jsonData = JSON.stringify({
      ...params.data,
      userprofile: params.userProfile,
    });
    const {url: jsonUrl} = await this.aswService.uploadFile({
      data: jsonData,
      encoding: 'utf8',
      dontPrependId: true,
      // ACL: 'private',
      bucket: this.env.AWS_S3_BUCKET_NAME,
      fileName: JsonFileName,
      mimeType: 'application/json',
      ignoreRestictFileType: true,
    });

    ThirdEyeLog.create({
      email: params?.userProfile?.email,
      fssaiUrl,
      mfgUrl,
      jsonUrl,
      data: params.data,
    }).catch(err => {
      log.error(`error while saving to thirdEye logs . ${err.message}`);
    });

    return {
      fssaiUrl,
      mfgUrl,
      jsonUrl,
    };
  }
}
