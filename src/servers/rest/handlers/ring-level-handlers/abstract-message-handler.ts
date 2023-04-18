/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
export interface Message {}
import {RestRingLevelMessageHandlerService} from './message-handler.service';

export interface MessageResponse {}

export interface MessageHandler {
  setNext(messageHandler: MessageHandler): MessageHandler;
  handle: (
    message: Message,
    service: RestRingLevelMessageHandlerService,
    response: MessageResponse,
  ) => Promise<void>;
}

export const unsupportedMessageTypeError = 'Unsupported message type';

export abstract class AbstractMessageHandler implements MessageHandler {
  public res: any;
  public nextMessageHandler?: MessageHandler;

  public setNext(messageHandler: MessageHandler): MessageHandler {
    this.nextMessageHandler = messageHandler;
    return messageHandler;
  }

  public async handle(
    message: Message,
    service: RestRingLevelMessageHandlerService,
    response: MessageResponse,
  ): Promise<void> {
    if (this.nextMessageHandler) {
      return this.nextMessageHandler.handle(message, service, response);
    }
    return;
  }
}
