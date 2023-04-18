/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {IProductRequest} from '@/servers/rest/controllers/product/product.openapi';
import {HttpErrors} from '@loopback/rest';
import {
  Brand,
  IOrgType,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';

export class SAPService {
  constructor() {}
  async createProduct(reqData: IProductRequest) {
    let productData: any = {};
    productData['desc'] = [];
    productData['assets'] = {};
    productData['attrs'] = [];
    const brand = await Brand.findOne({orgType: IOrgType.NETWORK});
    if (!brand || !brand?.did)
      throw new HttpErrors.NotFound(
        'network organization or its did not found',
      );
    productData['name'] = reqData.name;
    productData['lname'] = reqData.name.toLocaleLowerCase();
    productData.desc.push({val: reqData.description});
    productData['assets']['imgs'] = reqData.images.map(value => {
      return {src: value};
    });
    productData.attrs.push({name: 'subtitle', val: reqData.subtitle});
    productData.attrs.push({name: 'website', val: reqData.website});
    productData.attrs.push({name: 'ingredients', val: reqData.ingredients});
    productData.attrs.push({name: 'instructions', val: reqData.instructions});
    productData['brand'] = brand._id;
    // create product
    const product = await Item.create(productData);
    // create variant
    let gtinData: any = {};
    gtinData['attrs'] = [];
    gtinData['gtinKey'] = reqData.gtin.gtinKey;
    gtinData['item'] = product._id;
    gtinData.attrs.push({name: 'quantity', val: reqData.gtin.quantity});
    gtinData.attrs.push({
      name: 'quantityMetric',
      val: reqData.gtin.quantityMetric,
    });
    gtinData.attrs.push({name: 'price', val: reqData.gtin.price});
    gtinData.attrs.push({name: 'from', val: reqData.gtin.from});
    gtinData.attrs.push({name: 'desc', val: reqData.gtin.desc});
    const variant = await Variant.create(gtinData);
    return {success: true};
  }
}
