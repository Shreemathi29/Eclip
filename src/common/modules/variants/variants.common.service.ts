/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {ApplicationGatewayClient} from '@/clients/rest/application-gatewat.client';
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {log} from '@/utils';
import {constants} from '@/utils/constants';
import {inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Brand} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {
  IItem,
  Item,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {
  IVariant,
  Variant,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import _ from 'lodash';
import {Types} from 'mongoose';
import {Context} from 'vm';
import {CredentialConfig} from '../credential';
import {TemplateStyle} from '../templateStyle';
import {IUser} from '../users/user.model';
import {IssueGtinCred} from './issueGtinCredential';
import {varientAggregator} from './varients.aggregate.builder';
import {VarientsHelper} from './varients.helper';

export class VariantCommonService extends RequestCtxAbs {
  varientsHelper: VarientsHelper;
  constructor(
    @inject.context() protected ctx: Context,
    @service(ApplicationGatewayClient)
    private applicationGatewayClient: ApplicationGatewayClient,
    @service(MonarchaClient) private monarchaClient: MonarchaClient,
    @inject('ORG_ID') private orgId: string,
    @inject('config.credential') private credentialConfig: CredentialConfig,
  ) {
    super(ctx);
    this.varientsHelper = new VarientsHelper();
  }

  @authAndAuthZ('create', 'Variant')
  async uploadVariants({file}: {file: string}) {
    return await this.varientsHelper.uploadVariants(file);
  }

  @authAndAuthZ('create', 'Variant')
  async createVariant(data: any) {
    if (_.isEmpty(data)) {
      throw new HttpErrors.NotFound('Data not found');
    }
    // add lower case name
    data['lname'] = data.name.toLowerCase();
    if (data.item) {
      const product = await Item.findById(data.item);
      if (!product) {
        throw new HttpErrors.NotFound(constants.MESSAGES.PRODUCT_NOT_FOUND);
      }
    }
    const findVariant = await Variant.findOne({gtinKey: data.gtinKey});
    if (findVariant) {
      throw new HttpErrors.BadRequest(
        `Gtin is already created with gtinKey ${data.gtinKey}`,
      );
    }
    const variant = (await Variant.create(data)).toJSON();
    // add gtin lookup
    this.applicationGatewayClient
      .addGtinLookup({org: this.orgId, gtin: variant.gtinKey})
      .then(x => {
        log.info(`gtin: ${variant.gtinKey} is successfully added to gatway`);
      })
      .catch(err => {
        log.error(
          `error => gtin: ${variant.gtinKey} while adding  to gatway. err: ${err.message}`,
        );
        console.log(err);
      });
    // issue gtin credential
    this.issueGtinCredential(variant.gtinKey)
      .then(x => {
        log.info(`successfully issued credential to gtin: ${variant.gtinKey} `);
      })
      .catch(err => {
        log.error(
          `error => while issuing credential to gtin: ${variant.gtinKey}. err: ${err.message}`,
        );
        console.log(err);
      });
    return this.varientsHelper.getVarientResponse(variant);
  }
  @authAndAuthZ('read', 'Variant')
  async getVariant(_id: Types.ObjectId) {
    // first find the variant
    const variant = await Variant.findById(_id);
    if (!variant) {
      throw new HttpErrors.NotFound(constants.MESSAGES.VARIANT_NOT_FOUND);
    }
    return this.varientsHelper.getVarientResponse(variant);
  }

  @authAndAuthZ('update', 'Variant')
  async updateVariant({gtinId, data}: {gtinId: Types.ObjectId; data: any}) {
    const variant = await Variant.findById(gtinId);
    if (!variant) {
      throw new HttpErrors.NotFound(constants.MESSAGES.VARIANT_NOT_FOUND);
    }
    if (_.isEmpty(data)) {
      throw new HttpErrors.NotFound('Data not found');
    }

    if (data.item) {
      const product = await Item.findById(data.item);
      if (!product) {
        throw new HttpErrors.NotFound(constants.MESSAGES.PRODUCT_NOT_FOUND);
      }
    }
    // TODO: uncommnent this when variant has isLocked field
    // if (variant.isLocked) {
    //   throw new HttpErrors.BadRequest('Variant is locked');
    // }
    data['lname'] = data.name.toLowerCase();
    const updatedVariant = await Variant.findOneAndUpdate({_id: gtinId}, data, {
      new: true,
    });
    return this.varientsHelper.getVarientResponse(updatedVariant);
  }
  @authAndAuthZ('read', 'Variant')
  async getGtinsByProductID(where: {productId: Types.ObjectId}) {
    const variants = await Variant.find({item: where.productId});
    if (!variants || variants?.length == 0) {
      throw new HttpErrors.NotFound(constants.MESSAGES.VARIANT_NOT_FOUND);
    }
    const variantsArray = variants.map((variant: any) => {
      return this.varientsHelper.getVarientResponse(variant);
    });

    return variantsArray;
  }

  @authAndAuthZ('read', 'Variant')
  async findVariants({
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
    const variants = await varientAggregator({
      criteria,
      skip,
      limit,
      sort,
      sortOrder,
    });

    return variants;
  }

  @authAndAuthZ('create', 'Variant')
  async issueGtinCredential(gtinKey: string) {
    const user = (await this.getAccessUser()).user as IUser;
    const org = await Brand.findOne({_id: user?.organization});
    if (!org)
      throw new HttpErrors.NotFound(`org for user ${user?.email} not found`);

    const {gtin, prod, tempStyle} = await this.getGtinCredTempAndProd({
      gtinKey: gtinKey,
      templateName: 'product',
    });
    const keyVals = await this.formProductCredKeyVals({prod, gtin});
    const issueGtinCred = new IssueGtinCred(
      tempStyle,
      org,
      keyVals,
      org,
      user,
      this.monarchaClient,
      this.credentialConfig,
      gtin,
    );
    const ret = await issueGtinCred.issueCred();

    return ret;
  }

  private async getGtinCredTempAndProd({
    gtinKey,
    templateName,
  }: {
    gtinKey: string;
    templateName: string;
  }) {
    const gtin = await Variant.findOne({gtinKey});
    if (!gtin)
      throw new HttpErrors.NotFound(
        `at issued prodcut credential, gtin: ${gtinKey} not found`,
      );
    const prod = await Item.findOne({_id: gtin.item});
    if (!prod)
      throw new HttpErrors.NotFound(
        `at issued prodcut credential, product: ${gtin.item} not found`,
      );

    const prodOrg = await Brand.findOne({_id: prod.brand});
    if (!prodOrg)
      throw new HttpErrors.NotFound(
        `at issued prodcut credential, org: ${prod.brand} not found`,
      );
    const tempStyle = await TemplateStyle.findOne({name: templateName});
    if (!tempStyle)
      throw new HttpErrors.NotFound(
        `at issued prodcut credential, tempStyle: ${templateName} not found`,
      );
    return {gtin, prod, prodOrg, tempStyle};
  }

  private async formProductCredKeyVals({
    prod,
    gtin,
  }: {
    prod: IItem;
    gtin: IVariant;
  }) {
    // push nested product data
    // const ingredients = prod.attrs?.find(
    //   attr => attr.name === 'ingridients',
    // )?.val;
    // const subtitle = prod.attrs?.find(attr => attr.name === 'subtitle')?.val;
    const logo = prod.assets?.imgs?.[0]?.src;
    // const quantity = gtin.attrs?.find(attr => attr.name === 'quantity')?.val;
    // const quantityMetric = gtin.attrs?.find(
    //   attr => attr.name === 'quantityMetric',
    // )?.val;
    // const price = gtin.attrs?.find(attr => attr.name === 'price')?.val;
    // const from = gtin.attrs?.find(attr => attr.name === 'from')?.val;
    // const instructions = prod.attrs?.find(
    //   attr => attr.name === 'instructions',
    // )?.val;
    const attrs = (prod.attrs || []).concat(gtin.attrs || []);
    const prdGtinKeyVals = attrs.map(x => {
      return {key: x.name, value: x.val};
    });
    const keyVals = [
      {key: 'name', value: prod.name},
      {key: 'description', value: prod.desc?.[0].val},
      {key: 'gtin', value: gtin.gtinKey},
      // {key: 'subtitle', value: subtitle},
      // {key: 'quantity', value: quantity},
      // {key: 'ingredients', value: ingredients},
      {key: 'logo', value: logo},
      // {key: 'price', value: price},
      // {key: 'from', value: from},
      // {key: 'quantityMetric', value: quantityMetric},
      // {key: 'instructions', value: instructions},
    ];
    const allKeyvals = [...prdGtinKeyVals, ...keyVals];
    // console.log(keyVals);
    // const website = prod.attrs?.find(attr => attr.name === 'website');
    // keyVals.push({
    //   key: 'ingredients',
    //   value: ingredients ? ingredients[0].val : '',
    // });
    // keyVals.push({
    //   key: 'subtitle',
    //   value: subtitle ? subtitle[0].val : '',
    // });
    // keyVals.push({key: 'website', value: website ? website[0].val : ''});
    // prod.assets?.imgs.forEach((img: any) => {
    //   keyVals.push({key: 'logo', value: img.src});
    // });

    // push nested gtin data

    // const price = gtin.attrs?.filter(attr => attr.name === 'price');
    // const from = gtin.attrs?.filter(attr => attr.name === 'from');
    // keyVals.push({key: 'quantity', value: quantity ? quantity[0].val : ''});
    // keyVals.push({
    //   key: 'quantityMetric',
    //   value: quantityMetric ? quantityMetric[0].val : '',
    // });
    // keyVals.push({key: 'price', value: price ? price[0].val : ''});
    // keyVals.push({key: 'from', value: from ? from[0].val : ''});

    const filterd = allKeyvals
      .filter(x => !!x.value)
      .filter(x => _.isString(x.value)) as {
      key: string;
      value: string;
    }[];
    // console.log(filterd);
    return filterd;
  }
}
