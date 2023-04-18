/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {ServiceOrProviderClass} from '@loopback/core';

export function getServiceName(x: ServiceOrProviderClass<any>) {
  return `services.${x.name}`;
}
