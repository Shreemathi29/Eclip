/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {HolderCommonService} from '@/common/modules/holder/holder.common.service';
import {CommonBindings} from '@/common/request-context/common-bindings';
import {CommonRequestContext} from '@/common/request-context/request-context';
import {log} from '@/utils/logging';
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
import {WEBHOOK_ACKNOWLEDGEMENT, WEBHOOK_NOTIFICATION} from './webhook.openapi';

@oas.visibility(apiVisibility)
export class WebhookController {
  constructor(
    @inject.context() private ctx: any,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject(CommonBindings.COMMON_REQ_CTX)
    private myReqCtx: CommonRequestContext,
  ) {}

  @post('/org/wallet-webhook', {
    responses: {'200': WEBHOOK_ACKNOWLEDGEMENT},
  })
  async handelWebhook(
    @requestBody(WEBHOOK_NOTIFICATION) webhook: {type: string; payload: any},
  ) {
    switch (webhook.type) {
      case 'EMAIL_REGISTERED':
        await (
          await this.getHolderService()
        ).makeHolderRegistered(webhook.payload);
        break;
      default:
        log.warn(`event ${webhook.type} is not handled`);
    }
    return 'webhook handled successfully';
  }

  // private async getUserService() {
  //   return this.myReqCtx.get<UserCommonService>('services.UserCommonService');
  // }
  private async getHolderService() {
    return this.myReqCtx.getSync(
      getServiceName(HolderCommonService),
    ) as HolderCommonService;
  }
}
