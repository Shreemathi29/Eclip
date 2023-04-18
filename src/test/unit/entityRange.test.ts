/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {Types} from 'mongoose';
import {EntityRangeCommonService} from '../../common/modules/entityRange/entityRange.common.service';
import {initApp} from '../application.setup';
import {
  createEntityRangeInput,
  getBatchObj,
  getEntityRangeObj,
  getSerializationGroupObj,
  getVariantObj,
  TableInput,
} from '../seedData';
const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getEntityRangeCommonService() {
  return (await getReqCtx()).getSync(
    'services.EntityRangeCommonService',
  ) as EntityRangeCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('EntityRange Service', () => {
  it('Create EntityRange  - should return newly created EntityRange object', async () => {
    createEntityRangeInput.serializationGroupId = (
      await getSerializationGroupObj()
    )._id;
    createEntityRangeInput.productBatchId = (await getBatchObj())._id;
    createEntityRangeInput.gtinId = (await getVariantObj())._id;
    const entityRange = await getEntityRangeObj();
    createEntityRangeInput.data.lowerBound = entityRange.upperBound + 2;
    createEntityRangeInput.data.upperBound = entityRange.upperBound + 4;
    const result = await (
      await getEntityRangeCommonService()
    ).createEntityRange(createEntityRangeInput);

    expect(result).toBeTruthy();
  });
  it('EntityRangeTable - should return array of EntityRange objects', async () => {
    const result = await (
      await getEntityRangeCommonService()
    ).entityRangeTable(TableInput);

    expect(result).toBeTruthy();
  });
  it('Create EntityRange - should return error SerializationGroup by id not found', async () => {
    createEntityRangeInput.serializationGroupId = Types.ObjectId(
      '618236c67494694eac043b6f',
    );
    createEntityRangeInput.productBatchId = Types.ObjectId(
      '618236c67494694eac043b6f',
    );
    createEntityRangeInput.gtinId = Types.ObjectId('618236c67494694eac043b6f');
    createEntityRangeInput.data.lowerBound = 10;
    createEntityRangeInput.data.upperBound = 20;
    try {
      const result = await (
        await getEntityRangeCommonService()
      ).createEntityRange(createEntityRangeInput);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe(
        `serializationGroup by Id 618236c67494694eac043b6f not found`,
      );
    }
  });
  it('Create EntityRange - should return error lowerbound cannot be greater than upperbound', async () => {
    createEntityRangeInput.serializationGroupId = (
      await getSerializationGroupObj()
    )._id;
    createEntityRangeInput.productBatchId = Types.ObjectId(
      '618236c67494694eac043b6f',
    );
    createEntityRangeInput.gtinId = Types.ObjectId('618236c67494694eac043b6f');
    createEntityRangeInput.data.lowerBound = 30;
    createEntityRangeInput.data.upperBound = 20;
    try {
      const result = await (
        await getEntityRangeCommonService()
      ).createEntityRange(createEntityRangeInput);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe(
        `lowerbound cannot be greater than upperbound serializationGroup Id ${createEntityRangeInput.serializationGroupId}`,
      );
    }
  });
});
