/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {Types} from 'mongoose';
import {BatchCommonService} from '../../common/modules/batch/batch.common.service';
import {initApp} from '../application.setup';
import {
  createBatchInput,
  getBatchObj,
  getProductObj,
  getUserObj,
  TableInput,
  updateBatchInput,
} from '../seedData';
const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getBatchCommonService() {
  return (await getReqCtx()).getSync(
    'services.BatchCommonService',
  ) as BatchCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('Batch Service', () => {
  it('Create Batch - should return newly created Batch object', async () => {
    const item = await getProductObj();
    createBatchInput.where.productId = item._id;
    const user = await getUserObj();
    createBatchInput.data.creatorUser = user._id;
    const result = await (
      await getBatchCommonService()
    ).createBatch(createBatchInput);

    expect(result).toBeTruthy();
  });
  it('Update Batch - should return updated Batch object', async () => {
    const Batch = await getBatchObj();
    updateBatchInput.batch_id = Batch._id;
    const result = await (
      await getBatchCommonService()
    ).updateBatch(updateBatchInput);

    expect(result).toBeTruthy();
  });
  it('Get Batch - should return Batch object', async () => {
    const Batch = await getBatchObj();
    const result = await (
      await getBatchCommonService()
    ).getBatch({batch_id: Batch._id});

    expect(result).toBeTruthy();
  });
  it('Get Batches - should return array of Batch object', async () => {
    const result = await (
      await getBatchCommonService()
    ).findBatches(TableInput);

    expect(result).toBeTruthy();
  });
  it('Create Batch - should return error "product not found for id"', async () => {
    createBatchInput.where.productId = Types.ObjectId(
      '618236c67494694eac043b6f',
    );
    createBatchInput.data.creatorUser = '618236c67494694eac043b6f';
    try {
      const result = await (
        await getBatchCommonService()
      ).createBatch(createBatchInput);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe(
        `product not found for id ${createBatchInput.where.productId}`,
      );
    }
  });
  it('Create Batch - should return error "User not found"', async () => {
    const item = await getProductObj();
    createBatchInput.where.productId = item._id;
    createBatchInput.data.creatorUser = '618236c27494694eac043b6f';
    try {
      const result = await (
        await getBatchCommonService()
      ).createBatch(createBatchInput);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe(`User not found`);
    }
  });
  it('Update Batch - should return error "Batch not found"', async () => {
    try {
      updateBatchInput.batch_id = Types.ObjectId('618236c67494694eac043b6f');
      const result = await (
        await getBatchCommonService()
      ).updateBatch(updateBatchInput);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('Batch not found');
    }
  });
  it('Get Batch - should return error "Batch not found"', async () => {
    try {
      const batch_id = Types.ObjectId('618236c67494694eac043b6f');
      const result = await (await getBatchCommonService()).getBatch({batch_id});
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('Batch not found');
    }
  });
});
