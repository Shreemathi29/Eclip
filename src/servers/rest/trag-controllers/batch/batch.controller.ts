/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {BatchCommonService} from '@/common/modules/batch/batch.common.service';
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
import {GET_BATCHES_REQUEST, GET_BATCHES_RESPONSE} from './batch.openapi';

@oas.visibility(apiVisibility)
export class BatchController {
  constructor(
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
  ) {}

  @post('/getBatchesForGtin/no_auth', {
    responses: {
      '200': GET_BATCHES_RESPONSE,
    },
  })
  async getBatchesForGtinWithoutAuth(
    @requestBody(GET_BATCHES_REQUEST) reqBody: any,
  ) {
    return this.getBatchCommonService().getBatchesForGtin(reqBody);
  }

  @post('/getBatchesForGtin/with_auth', {
    responses: {
      '200': GET_BATCHES_RESPONSE,
    },
  })
  async getBatchesForGtinWithAuth(
    @requestBody(GET_BATCHES_REQUEST) reqBody: any,
  ) {
    return this.getBatchCommonService().getBatchesForGtin(reqBody);
  }

  private getBatchCommonService() {
    return this.reCtx.getSync(
      getServiceName(BatchCommonService),
    ) as BatchCommonService;
  }
}
