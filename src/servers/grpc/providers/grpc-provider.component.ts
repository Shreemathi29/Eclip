/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {Component} from '@loopback/core';
import {PingerGRPCProvider} from '.';

export class GRPCProviderComponent implements Component {
  providers: any;
  constructor() {
    this.providers = {
      'GRPCProviderComponent.PingerGRPCProvider': PingerGRPCProvider,
    };
  }
}
