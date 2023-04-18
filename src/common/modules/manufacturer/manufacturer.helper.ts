/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

export class ManufacturerHelper {
  constructor() {}

  getManufacturerRes(org: any) {
    const res: any = {};
    res.website = '';
    if (org.socialLinks) {
      org.socialLinks.map((linksObj: any) => {
        if (linksObj.type == 'website') {
          res.website = linksObj.url;
        }
      });
    }
    return {...res, ...org._doc};
  }
}
