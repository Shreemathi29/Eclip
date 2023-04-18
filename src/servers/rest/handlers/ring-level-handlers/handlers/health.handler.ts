/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log, pretty} from '@utils/logging';
import {
  AbstractMessageHandler,
  Message,
  MessageResponse,
} from '../abstract-message-handler';
import {RestRingLevelMessageHandlerService} from '../message-handler.service';

const is = require('is_js');

export class HealthHandler extends AbstractMessageHandler {
  name = 'health-ring-level';
  async handle(
    message: Message,
    service: RestRingLevelMessageHandlerService,
    response: MessageResponse,
  ) {
    try {
      const healthService = service.getHealthService();
      log.info(`|-> ${this.name} Initialization`);
      await healthService.init();
      log.info(`<-| ${this.name} Initialization`);
    } catch (e) {
      log.error(`Error in ${this.name} => ${pretty(e.message)}`);
    }
    return super.handle(message, service, response);
  }
}
