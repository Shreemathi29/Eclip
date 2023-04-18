/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {SerializationGroupCommonService} from '../../common/modules/serializationGroup/serializationGroup.common.service';
import {initApp} from '../application.setup';
import {createSerializationGroupInput, TableInput} from '../seedData';
const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getSerializationGroupCommonService() {
  return (await getReqCtx()).getSync(
    'services.SerializationGroupCommonService',
  ) as SerializationGroupCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('SerializationGroup Service', () => {
  it('Create SerializationGroup  - should return newly created SerializationGroup object', async () => {
    const result = await (
      await getSerializationGroupCommonService()
    ).createSerializationGroup(createSerializationGroupInput);

    expect(result).toBeTruthy();
  });
  it('SerializationGroupTable - should return array of SerializationGroup objects', async () => {
    const result = await (
      await getSerializationGroupCommonService()
    ).serializationGroupTable(TableInput);

    expect(result).toBeTruthy();
  });
  it('Get SerializationGroups - should return array of SerializationGroup objects', async () => {
    const result = await (
      await getSerializationGroupCommonService()
    ).getSerializationGroups();

    expect(result).toBeTruthy();
  });
});
