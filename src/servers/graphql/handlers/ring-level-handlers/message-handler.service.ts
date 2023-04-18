/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {bind, BindingScope, inject} from '@loopback/core';
import {
  GraphqlHealthService,
  GraphqlServiceDiscoveryService,
} from '@servers/graphql/services';
import {Message} from './abstract-message-handler';
import {HealthHandler, ServiceDiscoveryHandler} from './handlers';

@bind({scope: BindingScope.SINGLETON})
export class GraphqlRingLevelMessageHandlerService {
  messageHandler: any;
  result: any;
  constructor(
    @inject('services.GraphqlHealthService')
    private healthService: GraphqlHealthService,
    @inject('services.GraphqlServiceDiscoveryService')
    private serviceDiscoveryService: GraphqlServiceDiscoveryService,
  ) {
    const messageHandler = new HealthHandler();
    messageHandler.setNext(new ServiceDiscoveryHandler());

    this.messageHandler = messageHandler;
    this.result = messageHandler.res;
  }

  public async handleMessage(message: Message) {
    let response: any = {};
    if (!this.messageHandler) {
      return Promise.reject('Message handler not provided');
    }
    try {
      await this.messageHandler.handle(message, this, response);
      return response;
    } catch (err) {
      console.log(`Error in handle ring level messaging => ${err}`);
    }
  }

  getHealthService() {
    return this.healthService;
  }

  getServiceDiscoveryService() {
    return this.serviceDiscoveryService;
  }
}
