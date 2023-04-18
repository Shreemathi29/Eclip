/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {Types} from 'mongoose';
import {ProductCommonService} from '../../common/modules/products/products.common.service';
import {initApp} from '../application.setup';
import {
  createProductInput,
  getProductObj,
  updateProductInput,
} from '../seedData';
const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getProductCommonService() {
  return (await getReqCtx()).getSync(
    'services.ProductCommonService',
  ) as ProductCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('Product Service', () => {
  it('Create Product - should return newly created product object', async () => {
    const result = await (
      await getProductCommonService()
    ).createProduct(createProductInput);

    expect(result).toBeTruthy();
  });
  it('Update Product - should return updated product object', async () => {
    const product = await getProductObj();
    updateProductInput.productId = product._id;
    const result = await (
      await getProductCommonService()
    ).updateProduct(updateProductInput);

    expect(result).toBeTruthy();
  });
  it('Get Product - should return product object', async () => {
    const product = await getProductObj();
    const result = await (
      await getProductCommonService()
    ).getProduct(product._id);

    expect(result).toBeTruthy();
  });
  it('Get Products - should return array of product object', async () => {
    const result = await (
      await getProductCommonService()
    ).getProducts({criteria: ''});

    expect(result).toBeTruthy();
  });
  it('Get Product - should return error "Product not found"', async () => {
    const productId = Types.ObjectId('618236c67494694eac043b6f');
    try {
      const result = await (
        await getProductCommonService()
      ).getProduct(productId);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('Product not found');
    }
  });
  it('Update Product - should return error "Product not found"', async () => {
    try {
      updateProductInput.productId = Types.ObjectId('618236c67494694eac043b6f');
      const result = await (
        await getProductCommonService()
      ).updateProduct(updateProductInput);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('Product not found');
    }
  });
});
