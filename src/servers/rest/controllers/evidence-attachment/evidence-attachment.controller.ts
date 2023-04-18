/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {CommonBindings} from '@/common/request-context/common-bindings';
import {AWSService} from '@/common/services/aws-s3.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {inject} from '@loopback/core';
import {get, oas, param, Request, Response, RestBindings} from '@loopback/rest';
import {apiVisibility} from '../../openapi';

@oas.visibility(apiVisibility)
export class EvidenceAttachmentController {
  constructor(
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject(getServiceName(AWSService)) private awsService: AWSService,
  ) {}

  @get('/evidence-attachment/{externalId}/{bucket}/{key}')
  async getEvidenceDocument(
    @param.path.string('externalId') externalId: string,
    @param.path.string('bucket') bucket: string,
    @param.path.string('key') key: string,
  ) {
    const base64 = await this.awsService.getFile({key, bucket});
    return base64;
  }

  // @get('/test/aws')
  // async upload() {
  //   // const ret = await this.awsService.uploadFile({
  //   //   data: pdf,
  //   //   encoding: 'base64',
  //   //   fileName: 'evidence.pdf',
  //   //   bucket: process.env.AWS_S3_BUCKET_NAME,
  //   //   mimeType: 'application/pdf',
  //   // });
  //   const ret = await this.awsService.getFile({
  //     key: '5fd88a0b-03fc-46a5-80d3-5adee5298524-evidence.pdf',
  //     bucket: process.env.AWS_S3_BUCKET_NAME as string,
  //   });
  //   // console.log(ret);
  //   return ret;
  // }
}
