/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {ManufacturerCommonService} from '../../common/modules/manufacturer/manufacturer.common.service';
import {initApp} from '../application.setup';

const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getManufacturerCommonService() {
  return (await getReqCtx()).getSync(
    'services.ManufacturerCommonService',
  ) as ManufacturerCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('Manufacturer Service', () => {
  it('Get Manufacturer - should return Manufacturer object', async () => {
    const result = await (
      await getManufacturerCommonService()
    ).getManufacturer();

    expect(result).toBeTruthy();
  });
});
