/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {PingerService} from '@/common/services';
import {initApp} from '../application.setup';

const app = initApp();

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});

describe('Pinger Service', () => {
  const pingerService = app.getSync('services.PingerService') as PingerService;
  it('ping - should return Hello World', async () => {
    const result = await pingerService.ping('World');
    expect(result).toEqual({name: 'Hello World'});
  });
});
