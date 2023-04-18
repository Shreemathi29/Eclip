/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {FeedbackCommonService} from '@/common/modules/feedback/feedback.common.service';
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
import {
  CREATE_FEEDBACK_REQUEST,
  CREATE_FEEDBACK_RESPONSE,
} from './feedback.openapi';

@oas.visibility(apiVisibility)
export class FeedbackController {
  constructor(
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
  ) {}

  // @post('/feedback/create/', {
  //   responses: {
  //     '200': CREATE_FEEDBACK_RESPONSE,
  //   },
  // })
  // async createFeedback(@requestBody(CREATE_FEEDBACK_REQUEST) reqBody: any) {
  //   return await this.getFeedbackService().createFeedback(reqBody);
  // }

  @post('/feedback/create/with_auth', {
    responses: {
      '200': CREATE_FEEDBACK_RESPONSE,
    },
  })
  async createFeedbackWithAuth(
    @requestBody(CREATE_FEEDBACK_REQUEST) reqBody: any,
  ) {
    return await this.getFeedbackService().createFeedback(reqBody);
  }

  @post('/feedback/create/no_auth', {
    responses: {
      '200': CREATE_FEEDBACK_RESPONSE,
    },
  })
  async createFeedbackWithoutAuth(
    @requestBody(CREATE_FEEDBACK_REQUEST) reqBody: any,
  ) {
    return await this.getFeedbackService().createFeedback(reqBody);
  }

  private getFeedbackService() {
    return this.reCtx.getSync(
      getServiceName(FeedbackCommonService),
    ) as FeedbackCommonService;
  }
}
