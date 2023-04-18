/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {CampaignCommonService} from '../../common/modules/campaign/campaign.common.service';
import {initApp} from '../application.setup';
import {TableInput} from '../seedData';
const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getCampaignCommonService() {
  return (await getReqCtx()).getSync(
    'services.CampaignCommonService',
  ) as CampaignCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('Campaign Service', () => {
  it('Get Campaign Table - should return array of campaign table objects', async () => {
    const result = await (
      await getCampaignCommonService()
    ).getCampaignTables(TableInput);

    expect(result).toBeTruthy();
  });
});
