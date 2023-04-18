/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {ProvSuggestionsCommonService} from '@/common/modules/fullProvenance/provSuggestions.common.service';
import {ThirdEyeCommonService} from '@/common/modules/thirdEye/thirdEye.common.service';
import {CommonBindings} from '@/common/request-context/common-bindings';
import {getServiceName} from '@/utils/loopbackUtils';
import {inject, service} from '@loopback/core';
import {
  oas,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {apiVisibility} from '../../openapi';
import {
  UPLOAD_THIRDEYE_LOG_REQUEST,
  UPLOAD_THIRDEYE_LOG_RESPONSE,
} from './thirdEye.openapi';

const useragent = require('useragent');
@oas.visibility(apiVisibility)
export class ThirdEyeController {
  constructor(
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @service(ProvSuggestionsCommonService)
    private provSuggestionsCommonService: ProvSuggestionsCommonService,
  ) {}

  @post('vlinder-core/third-eye/upload/with_auth', {
    responses: {'200': UPLOAD_THIRDEYE_LOG_RESPONSE},
  })
  async uploadThirEyeLog(@requestBody(UPLOAD_THIRDEYE_LOG_REQUEST) param: any) {
    const ret = await this.getThirdEyeCommonService().thirdEyeUpload(param);
    return ret;
    // add user-agent in params
    // param.user_agent = useragent.lookup(this.req.headers['user-agent']);
  }

  private getThirdEyeCommonService() {
    return this.reCtx.getSync(
      getServiceName(ThirdEyeCommonService),
    ) as ThirdEyeCommonService;
  }
}

// after full provdennace cover product and step cred - change endpoint names only and check email for user
