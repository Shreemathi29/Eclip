/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {EncodeCommonService} from '@/common/modules/encode/encode.common.service';
import {CommonBindings} from '@/common/request-context/common-bindings';
import {getServiceName} from '@/utils/loopbackUtils';
import {inject} from '@loopback/core';
import {
  oas,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {apiVisibility} from '../../openapi';

@oas.visibility(apiVisibility)
export class EncoderController {
  constructor(
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
  ) {}

  @post('/get_nfc_encode_hash')
  async getNFCEncodeHash(@requestBody() reqBody: any) {
    const ret = await this.getEncodeService().getEncodeNFCTokenId(reqBody);
    return ret;
    // return reqBody;
  }
  @post('/create_encode_log')
  async createEncodeHash(@requestBody() reqBody: any) {
    // return reqBody;
    const ret = await this.getEncodeService().createEncodeLog(reqBody);
    return ret;
  }

  // Private funs

  private getEncodeService() {
    return this.reCtx.getSync(
      getServiceName(EncodeCommonService),
    ) as EncodeCommonService;
  }
}
