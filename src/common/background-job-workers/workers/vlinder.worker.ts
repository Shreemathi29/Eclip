/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log, pretty} from '@utils/logging';
import {randomIntFromInterval, sleep} from '@utils/sleep';

export const vlinderWorker = async (msg: {
  id: string;
  payload: any;
  lbApp: any;
}) => {
  const name = 'vlinder-worker';
  try {
    //Core functionality here !!
    log.info(`vlinderWorker msg: ${pretty(msg.payload)}`);
  } catch (err) {
    log.error(`Error in ${name} => ${pretty(err?.message)}`);
    const _time = randomIntFromInterval(1000, 3000);
    log.error(`retrying in ${_time / 1000} seconds`);
    await sleep(_time);
    throw Error(`Error in ${name} => ${pretty(err?.message)}`);
  }
};
