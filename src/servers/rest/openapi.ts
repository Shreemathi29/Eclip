/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {OperationVisibility} from '@loopback/rest';
import {EnvModule} from '@utils/EnvModule';

export const isdevEnv = EnvModule?.getInstance()?.getEnv().NODE_ENV === 'dev';

export const apiVisibility = isdevEnv
  ? OperationVisibility.DOCUMENTED
  : OperationVisibility.UNDOCUMENTED;
