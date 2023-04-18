/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {Types} from 'mongoose';
import {VariantCommonService} from '../../common/modules/variants/variants.common.service';
import {initApp} from '../application.setup';
import {
  createVariantInput,
  getProductObj,
  getVariantObj,
  updateVariantInput,
} from '../seedData';

const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getVariantCommonService() {
  return (await getReqCtx()).getSync(
    'services.VariantCommonService',
  ) as VariantCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('Variant Service', () => {
  it('Create Variant - should return newly created Variant object', async () => {
    const item = await getProductObj();
    createVariantInput.item = item._id;
    const result = await (
      await getVariantCommonService()
    ).createVariant(createVariantInput);

    expect(result).toBeTruthy();
  });
  it('Update Variant - should return updated Variant object', async () => {
    const variant = await getVariantObj();
    updateVariantInput.gtinId = variant._id;
    updateVariantInput.data.gtinKey = `21${Date.now()}`;
    const result = await (
      await getVariantCommonService()
    ).updateVariant(updateVariantInput);

    expect(result).toBeTruthy();
  });
  it('Get Variant - should return Variant object', async () => {
    const variant = await getVariantObj();
    const result = await (
      await getVariantCommonService()
    ).getVariant(variant._id);

    expect(result).toBeTruthy();
  });
  it('Get Variants - should return array of Variants object', async () => {
    const item = await getProductObj();
    const where = {
      productId: item._id,
    };
    const result = await (
      await getVariantCommonService()
    ).getGtinsByProductID(where);

    expect(result).toBeTruthy();
  });
  it('Find Variants - should return array of Variants object', async () => {
    const result = await (
      await getVariantCommonService()
    ).findVariants({criteria: ''});

    expect(result).toBeTruthy();
  });
  it('Create Variant - should return error "Data not found"', async () => {
    const item = await getProductObj();
    createVariantInput.item = item._id;
    try {
      const result = await (await getVariantCommonService()).createVariant({});
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('Data not found');
    }
  });
  it('Create Variant - should return error "Product not found"', async () => {
    createVariantInput.item = '618236c67494694eac043b6f';
    try {
      const result = await (
        await getVariantCommonService()
      ).createVariant(createVariantInput);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('Product not found');
    }
  });
  it('Update Variant - should return error "VARIANT_NOT_FOUND"', async () => {
    updateVariantInput.gtinId = Types.ObjectId('618236c67494694eac043b6f');
    try {
      const result = await (
        await getVariantCommonService()
      ).updateVariant(updateVariantInput);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('VARIANT_NOT_FOUND');
    }
  });
  it('Get Variants - should return error "VARIANT_NOT_FOUND"', async () => {
    const where = {
      productId: Types.ObjectId('618236c67494694eac043b6f'),
    };
    try {
      const result = await (
        await getVariantCommonService()
      ).getGtinsByProductID(where);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('VARIANT_NOT_FOUND');
    }
  });
});
