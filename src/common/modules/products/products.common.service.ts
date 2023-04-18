/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {constants} from '@/utils/constants';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  Brand,
  IOrgType,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import _ from 'lodash';
import {Types} from 'mongoose';
import {Context} from 'vm';
import {IUser} from '../users/user.model';
import {productAggregator} from './product.aggregate.builder';
import {ProductHelper} from './product.helper';

export class ProductCommonService extends RequestCtxAbs {
  productHelper: ProductHelper;
  constructor(@inject.context() protected ctx: Context) {
    super(ctx);
    this.productHelper = new ProductHelper();
  }

  @authAndAuthZ('create', 'Product')
  async uploadProducts({file}: {file: string}) {
    const user = (await this.getAccessUser()).user as IUser;
    const org = await Brand.findOne({_id: user?.organization});
    return await this.productHelper.uploadProducts(file, org._id);
  }

  @authAndAuthZ('create', 'Product')
  async createProduct(reqData: any) {
    const brand = await Brand.findOne({orgType: IOrgType.NETWORK});
    if (!brand || !brand?.did)
      throw new HttpErrors.NotFound(
        'network organization or its did not found',
      );
    reqData['lname'] = reqData.name.toLowerCase();
    reqData['brand'] = brand._id;
    if (_.isEmpty(reqData)) {
      throw new HttpErrors.NotFound('Data not found');
    }
    const product = await Item.create(reqData);
    return this.productHelper.getProductResponse(product);
  }

  @authAndAuthZ('update', 'Product')
  async updateProduct({
    productId,
    data,
  }: {
    productId: Types.ObjectId;
    data: any;
  }) {
    const product = await Item.findById(productId);
    if (!product) {
      throw new HttpErrors.NotFound(constants.MESSAGES.PRODUCT_NOT_FOUND);
    }
    // No edit if product is locked
    // TODO: uncommnent this when product has isLocked field
    // if (product.isLocked) {
    //   throw new HttpErrors.BadRequest('Product is locked');
    // }
    if (_.isEmpty(data)) {
      throw new HttpErrors.NotFound('Data not found');
    }
    data['lname'] = data.name.toLowerCase();
    const editedProduct = await Item.findOneAndUpdate({_id: productId}, data, {
      new: true,
    });

    return this.productHelper.getProductResponse(editedProduct);
  }

  @authAndAuthZ('read', 'Product')
  async getProducts({
    criteria,
    skip,
    limit,
    sort,
    sortOrder,
  }: {
    criteria: any;
    skip?: number;
    limit?: number;
    sort?: string;
    sortOrder?: string;
  }) {
    const products = await productAggregator({
      criteria,
      skip,
      limit,
      sort,
      sortOrder,
    });

    return products;
  }

  @authAndAuthZ('read', 'Product')
  async getProduct(_id: Types.ObjectId) {
    // first find the product
    const product = await Item.findOne({_id: _id});
    if (!product) {
      throw new HttpErrors.NotFound(constants.MESSAGES.PRODUCT_NOT_FOUND);
    }
    return this.productHelper.getProductResponse(product);
  }
}
