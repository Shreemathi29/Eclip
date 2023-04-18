/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log, pretty} from '@utils/logging';
import {vlinderWorker} from './workers';

export const onWorkerMessage = async (_workerMsg: {
  name: string;
  id: any;
  payload: any;
  lbApp: any;
}) => {
  try {
    switch (_workerMsg?.name) {
      case 'vlinder':
        await vlinderWorker({
          id: _workerMsg?.id,
          payload: _workerMsg?.payload,
          lbApp: _workerMsg?.lbApp,
        });
        break;
      default:
        log.error(
          `unknown worker => ${_workerMsg?.name}. This worker is not supported`,
        );
    }
  } catch (err) {
    log.error(`error in worker handler message => ${pretty(err?.message)}`);
    throw Error(`error in worker handler message => ${pretty(err?.message)}`);
  }
};
