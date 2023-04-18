import { RequestCtxAbs } from '@/common/request-context/request-ctx-abs';
import { inject } from '@loopback/core';
import AWS from 'aws-sdk';
export class MasterDispatchCommonService extends RequestCtxAbs {
  constructor(
    context: any,
    @inject('services.masterDispatchService')
    private readonly masterDispatchService: MasterDispatchCommonService
  ) {
    super(context);
  }

  async getMasterDispatchData(key: string, bucket: string): Promise<string> {
    const s3 = new AWS.S3();
    const params = { Bucket: bucket, Key: key };
    const object = await s3.getObject(params).promise();
    return object.Body?.toString() ?? '';
  }
}
