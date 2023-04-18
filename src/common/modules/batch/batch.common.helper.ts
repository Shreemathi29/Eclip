/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log} from '@/utils';
import {constants} from '@/utils/constants';
import {HttpErrors} from '@loopback/rest';
import {isValidObjectId, models} from 'mongoose';
import {MiscCommonHelper} from '../misc/misc.common.helper';
import {Batch} from './batch.model';
export class BatchHelper {
  private miscHelper: MiscCommonHelper;
  private currentUserId: string;
  constructor() {
    this.miscHelper = new MiscCommonHelper();
  }

  async uploadBatches(base64: string, currentUserId: string) {
    this.currentUserId = currentUserId;
    const columns: string[] = [
      'name',
      'description',
      'gtins',
      'product',
      'manufacturedate',
      'shelflife',
    ];
    const isValid = await this.miscHelper.validateCsv(base64, columns);
    if (!isValid) throw new HttpErrors.BadRequest(`invalid format`);

    const baseRows = (await this.miscHelper.parseCsv(base64)) as any[];
    const {validRows, invalidRows} = await this.parseBatches(baseRows);

    //TODO: Insert invaild rows in a separate model.
    console.log('invalid', invalidRows);

    if (validRows.length > 0) {
      const items = await Batch.insertMany(validRows, {ordered: false});
      log.info(`${(items as unknown as any[]).length} Batches created`);
    }
    return constants.MESSAGES.BATCH_UPLOADED_SUCCESSFULLY;
  }

  private async parseBatches(baseRows: any[]) {
    const invalidRows: any = [];
    const validRows: any = [];
    baseRows.map(row => {
      if (
        !row.name ||
        !(row.product && isValidObjectId(row.brand_id)) ||
        !row.gtins
      ) {
        invalidRows.push(row);
      } else {
        validRows.push(row);
      }
    });
    const newValidRows: any = [];
    for (let i = 0; i < validRows.length; i++) {
      const variants: string[] | boolean = await this.validateVariants(
        validRows[i].gtins,
      );
      const item = await models.item.findById(validRows[i].product);
      // name and item combination should be unique.
      const batch = await models.batch.findOne({
        $and: [{name: validRows[i].name}, {item: validRows[i].product}],
      });

      if (!item || !variants || batch) {
        invalidRows.push(validRows[i]);
      } else {
        validRows[i].variants = variants;
        newValidRows.push(validRows[i]);
      }
    }
    const formattedRows = this.formatRows(newValidRows);

    return {
      validRows: formattedRows,
      invalidRows: invalidRows,
    };
  }

  private formatRows(batches: any[]) {
    const formattedRows: any = [];
    batches.map(row => {
      const batch: any = {};

      batch['name'] = row.name;
      batch['description'] = row.description;
      batch['creatorUser'] = this.currentUserId;
      batch['variants'] = row.gtins;
      batch['item'] = row.product;
      if (row.manufacturedate) {
        const d = new Date(row.manufacturedate);
        if (!isNaN(d.getTime())) {
          batch['manufactureDate'] = d.toISOString();
        }
      }
      if (row.shelflife) {
        const d = new Date(row.shelflife);
        if (!isNaN(d.getTime())) {
          batch['shelfLife'] = d.toISOString();
        }
      }
      formattedRows.push(batch);
    });
    return formattedRows;
  }

  private async validateVariants(variants: string) {
    let variantsArray: string[] = [];

    if (variants.includes(',')) {
      variantsArray = variants.split(',');
      for (let i = 0; i < variantsArray.length; i++) {
        if (!isValidObjectId(variantsArray[i])) return false;
      }
    } else {
      if (!isValidObjectId(variants)) {
        return false;
      }
      variantsArray.push(variants);
    }

    const variantsObjArray = await models.variant.find({
      _id: {$in: variantsArray},
    });
    if (variantsObjArray.length !== variantsArray.length) {
      return false;
    }

    return variantsArray;
  }
}
