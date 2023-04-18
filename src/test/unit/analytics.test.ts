/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {AnalyticsCommonService} from '../../common/modules/analytics/analytics.service';
import {initApp} from '../application.setup';
const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getAnalyticsCommonService() {
  return (await getReqCtx()).getSync(
    'services.AnalyticsCommonService',
  ) as AnalyticsCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('Analytics Service', () => {
  it('Get Analytics - should return Analytics object', async () => {
    const result = await (await getAnalyticsCommonService()).getAnalytics();

    expect(result).toBeTruthy();
  });
  it('Refresh Analytics - should return "refresh initiated"', async () => {
    const result = await (await getAnalyticsCommonService()).refresh();

    expect(result).toBeTruthy();
  });
  it('Refresh Analytics - should return "A refresh was just initaiated"', async () => {
    try {
      const result = await (await getAnalyticsCommonService()).refresh();
      const newResult = await (await getAnalyticsCommonService()).refresh();
      expect(newResult).toBe(false);
    } catch (e) {
      expect(e.message.includes('A refresh was just initaiated')).toBe(true);
    }
  });
});
