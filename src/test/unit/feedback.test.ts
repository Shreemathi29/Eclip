/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {FeedbackCommonService} from '../../common/modules/feedback/feedback.common.service';
import {initApp} from '../application.setup';
import {TableInput} from '../seedData';
const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getFeedbackCommonService() {
  return (await getReqCtx()).getSync(
    'services.FeedbackCommonService',
  ) as FeedbackCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('Feedback Service', () => {
  it('Feedback Table - should return array of Feedback object', async () => {
    const result = await (
      await getFeedbackCommonService()
    ).feedbackTable(TableInput);

    expect(result).toBeTruthy();
  });
});
