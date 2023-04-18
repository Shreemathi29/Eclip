/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log} from '@/utils';
import {constants} from '@/utils/constants';
import {HttpErrors} from '@loopback/rest';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {MiscCommonHelper} from '../misc/misc.common.helper';
export class ProductHelper {
  private miscHelper: MiscCommonHelper;
  constructor() {
    this.miscHelper = new MiscCommonHelper();
  }

  getProductResponse(product: any) {
    const res: any = {};
    res.description = '';
    res.subtitle = '';
    res.website = '';
    res.ingredients = '';
    res.instructions = '';
    res.images = [];
    res.productImageUrl = [];
    if (product.desc[0]) {
      res.description = product.desc[0].val;
    }
    if (product.desc[1]) {
      res.subtitle = product.desc[1].val;
    }
    if (product.attrs) {
      product.attrs?.map((obj: any) => {
        if (obj?.name == 'ingredients') {
          res.ingredients = obj.val;
        }
        if (obj?.name == 'instructions') {
          res.instructions = obj.val;
        }
      });
    }
    if (product?.assets?.imgs) {
      product.assets.imgs.map((obj: any) => {
        obj.src ? res.images.push(obj.src) : '';
      });
    }
    //TODO: from where we can access website field?
    res.orgName = product?.Brand?.name;
    if (product._doc) {
      return {...res, ...product._doc};
    }
    res.productImageUrl = res.images;
    return {...res, ...product};
  }

  async uploadProducts(base64: string, brand_id: string) {
    const columns: string[] = [
      'name',
      'desc_val_1',
      'desc_val_2',
      'img_url_1',
      'img_url_2',
      'attrs_name_1',
      'attrs_value_1',
      'attrs_name_2',
      'attrs_value_2',
    ];
    const isValid = await this.miscHelper.validateCsv(base64, columns);
    if (!isValid) throw new HttpErrors.BadRequest(`invalid format`);
    const baseRows = (await this.miscHelper.parseCsv(base64)) as any[];
    const {validRows, invalidRows} = await this.parseProducts(
      baseRows,
      brand_id,
    );

    //TODO: Insert invaild rows in a separate model.
    console.log('invalid', invalidRows);

    if (validRows.length > 0) {
      const items = await Item.insertMany(validRows, {ordered: false});
      log.info(`${(items as unknown as any[]).length} Products created`);
    }
    return constants.MESSAGES.PRODUCT_UPLOADED_SUCCESSFULLY;
  }
  private async parseProducts(baseRows: any[], brand_id: string) {
    const invalidRows: any = [];
    const validRows: any = [];
    baseRows.map(row => {
      if (!row.name || !(row.img_url_1 || row.img_url_1)) {
        invalidRows.push(row);
      } else {
        row.brand_id = brand_id;
        validRows.push(row);
      }
    });
    const formattedRows = this.formatRows(validRows);

    return {
      validRows: formattedRows,
      invalidRows: invalidRows,
    };
  }

  private formatRows(ItemRows: any[]) {
    const formattedRows: any = [];
    ItemRows.map(row => {
      const item: any = {};

      item['name'] = row.name;
      item['lname'] = row.name.toLowerCase();
      item['brand'] = row.brand_id;
      const descArray = [
        {
          val: row.desc_val_1 || '',
        },
        {
          val: row.desc_val_2 || '',
        },
      ];
      item['desc'] = descArray;
      const assetsObj = {
        imgs: [
          {
            src: row.img_url_1 || '',
          },
          {
            src: row.img_url_2 || '',
          },
        ],
      };
      item['assets'] = assetsObj;
      const attrsArray = [
        {
          name: row.attrs_name_1 || '',
          val: row.attrs_value_1 || '',
        },
        {
          name: row.attrs_name_2 || '',
          val: row.attrs_value_2 || '',
        },
      ];
      item['attrs'] = attrsArray;
      formattedRows.push(item);
    });
    return formattedRows;
  }
}
