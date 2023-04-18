/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {ScanLogTableCommonService} from '../../common/modules/scanLog/scanLog.common.service';
import {initApp} from '../application.setup';
import {TableInput} from '../seedData';
const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getScanLogTableCommonService() {
  return (await getReqCtx()).getSync(
    'services.ScanLogTableCommonService',
  ) as ScanLogTableCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('Scanlog Service', () => {
  it('Get ScanlogTable - should return array of scanlog objects ', async () => {
    const result = await (
      await getScanLogTableCommonService()
    ).getScanLogTable(TableInput);

    expect(result).toBeTruthy();
  });
});
