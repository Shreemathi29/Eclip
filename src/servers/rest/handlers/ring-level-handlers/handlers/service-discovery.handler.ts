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

export class ServiceDiscoveryHandler extends AbstractMessageHandler {
  name = 'service-discovery-ring-level';
  async handle(
    message: Message,
    service: RestRingLevelMessageHandlerService,
    response: MessageResponse,
  ) {
    try {
      const serviceDiscoveryService = service.getServiceDiscoveryService();
      log.info(`|-> ${this.name} Initialization`);
      await serviceDiscoveryService.init();
      log.info(`<-| ${this.name} Initialization`);
    } catch (e) {
      log.error(
        `Error in service discovery ring level init => ${pretty(e.message)}`,
      );
    }
    return super.handle(message, service, response);
  }
}
