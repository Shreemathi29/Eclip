/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log} from '@/utils';
import {constants} from '@/utils/constants';
import {HttpErrors} from '@loopback/rest';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import {isValidObjectId} from 'mongoose';
import {MiscCommonHelper} from '../misc/misc.common.helper';

export class VarientsHelper {
  private miscHelper: MiscCommonHelper;
  constructor() {
    this.miscHelper = new MiscCommonHelper();
  }

  getVarientResponse(varient: any) {
    const res: any = {};
    res.description = '';
    res.price = '';
    res.quantity = '';
    res.from = ''; //TODO: from where we can access "from" ?
    res.quantityMetric = '';

    if (varient.attrs) {
      varient.attrs.map((obj: any) => {
        if (obj.name == 'price') {
          res.price = obj.val;
        }
        if (obj.name == 'quantity') {
          res.quantity = obj.val;
        }
        if (obj.name == 'quantityMetric') {
          res.quantityMetric = obj.val;
        }
      });
    }
    if (varient._doc) {
      return {...res, ...varient._doc};
    }
    return {...res, ...varient};
  }

  async uploadVariants(base64: string) {
    const columns: string[] = [
      'name',
      'product',
      'gtinkey',
      'attrs_name_1',
      'attrs_value_1',
      'attrs_name_2',
      'attrs_value_2',
      'attrs_name_3',
      'attrs_value_3',
    ];
    const isValid = await this.miscHelper.validateCsv(base64, columns);
    if (!isValid) throw new HttpErrors.BadRequest(`invalid format`);

    const baseRows = (await this.miscHelper.parseCsv(base64)) as any[];
    const validationRes = await this.validateRows(baseRows);
    const formattedRows = this.formatRows(validationRes.newValidRows);
    //TODO: Insert invaild rows in a separate model.
    log.info('invalid', validationRes?.invalidRows);
    if (validationRes?.invalidRows.length > 0) {
      throw new HttpErrors.BadRequest(
        `Invalid row found ` + JSON.stringify(validationRes?.invalidRows),
      );
    }

    if (formattedRows.length > 0) {
      const variants = await Variant.insertMany(formattedRows, {
        ordered: false,
      });
      log.info(`${(variants as unknown as any[]).length} Variants created`);
    }
    return constants.MESSAGES.VARIANT_UPLOADED_SUCCESSFULLY;
  }

  private async getAllProductsById(validRows: any[]) {
    const productIds = validRows.map(row => row?.product);
    const products = await Item.find(
      {
        _id: {
          $in: productIds,
        },
      },
      {_id: 1},
    );
    const productList = products.map((product: {_id: any}) =>
      product._id.toString(),
    );
    return productList;
  }

  private async getAllGtinsByGtinKey(validRows: any[]) {
    const gtinKeys = validRows.map(row => row?.gtinkey);
    const variants = await Variant.find(
      {
        gtinKey: {
          $in: gtinKeys,
        },
      },
      {gtinKey: 1},
    );
    const variantsList = variants.map(
      (variant: {gtinKey: any}) => variant.gtinKey,
    );
    return variantsList;
  }

  private async validateRows(baseRows: any[]) {
    const invalidRows: any = [];
    const validRows: any = [];
    baseRows.map(row => {
      if (
        !row.name ||
        !(row.product && isValidObjectId(row.product)) ||
        !row.gtinkey
      ) {
        row.error = 'name, product or gtinkey is missing';
        invalidRows.push(row);
      } else {
        validRows.push(row);
      }
    });
    const newValidRows: any = [];
    const allItemsIds = await this.getAllProductsById(validRows);
    const allGtinKeys = await this.getAllGtinsByGtinKey(validRows);
    for (let i = 0; i < validRows.length; i++) {
      const isItemExists = allItemsIds.includes(validRows[i].product);
      const isGtinExists = allGtinKeys.includes(validRows[i].gtinkey);
      if (isItemExists == false || isGtinExists == true) {
        validRows[
          i
        ].error = `product ${validRows[i].product} not found or variant ${validRows[i].gtinkey} already exists`;
        invalidRows.push(validRows[i]);
      } else {
        newValidRows.push(validRows[i]);
      }
    }
    return {newValidRows, invalidRows};
  }

  private formatRows(VariantRows: any[]) {
    const formattedRows: any = [];
    VariantRows.map(row => {
      const variant: any = {};

      variant['name'] = row.name;
      variant['lname'] = row.name.toLowerCase();
      variant['item'] = row.product;
      variant['gtinKey'] = row.gtinkey;
      const attrsArray = [
        {
          name: row.attrs_name_1 || '',
          val: row.attrs_value_1 || '',
        },
        {
          name: row.attrs_name_2 || '',
          val: row.attrs_value_2 || '',
        },
        {
          name: row.attrs_name_3 || '',
          val: row.attrs_value_3 || '',
        },
      ];
      variant['attrs'] = attrsArray;
      formattedRows.push(variant);
    });
    return formattedRows;
  }
}
