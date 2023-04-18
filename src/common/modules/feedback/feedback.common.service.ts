/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {CommonBindings} from '@/common/request-context/common-bindings';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {EmailGeneratorService, EmailType} from '@/common/services';
import {GeocoderService} from '@/common/services/geocoder.service';
import {constants} from '@/utils/constants';
import {log} from '@/utils/logging';
import {bind, BindingScope, inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import {Context} from 'vm';
import {Batch} from '../batch/batch.model';
import {DashboardTableCommonService} from '../dashboardTable/dashboardTable.common.service';
import {Feedback} from './feedback.model';
@bind({scope: BindingScope.SINGLETON})
export class FeedbackCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @service(GeocoderService) private geoCoder: GeocoderService,
    @inject('services.DashboardTableCommonService')
    private dbTableCommonServ: DashboardTableCommonService,
    @inject('services.EmailGeneratorService')
    private emailGeneratorService: EmailGeneratorService,
    @inject(CommonBindings.IP, {optional: true}) private reqIP?: string,
  ) {
    super(ctx);
  }
  // @authAndAuthZ('create', 'Feedback')
  // async createFeedback(reqData: any) {
  //   if (reqData.userId) {
  //     const user = await models.user.findById(reqData.userId);
  //     if (!user) {
  //       throw new HttpErrors.NotFound('User not found');
  //     }
  //   }
  //   if (reqData.gtin) {
  //     const gtin = await models.variant.findById(reqData.gtin);
  //     if (!gtin) {
  //       throw new HttpErrors.NotFound('Gtin not found');
  //     }
  //   }
  //   if (reqData.batch) {
  //     const batch = await models.batch.findById(reqData.batch);
  //     if (!batch) {
  //       throw new HttpErrors.NotFound('Batch not found');
  //     }
  //   }
  //   if (reqData.product) {
  //     const product = await models.item.findById(reqData.product);
  //     if (!product) {
  //       throw new HttpErrors.NotFound('Product not found');
  //     }
  //   }
  //   const feedback = await Feedback.create(reqData);

  //   return {
  //     data: feedback,
  //   };
  // }

  async createFeedback(reqData: any) {
    // find a gtin with gtinKey
    const gtin = await Variant.findOne({gtinKey: reqData.gtin});
    if (!gtin) {
      throw new HttpErrors.NotFound(constants.MESSAGES.VARIANT_NOT_FOUND);
    }

    // find product
    const product = await Item.findOne({_id: gtin.item});
    if (!product) {
      throw new HttpErrors.NotFound(constants.MESSAGES.PRODUCT_NOT_FOUND);
    }

    // find batch
    const batch = await Batch.findOne({
      name: reqData.batchNo,
      variants: {$elemMatch: {$eq: gtin._id}},
    });

    const feedbackData: any = {
      rating: reqData.rating,
      comments: reqData.comments ? reqData.comments : '',
      scanType: reqData.scanType ? reqData.scanType : '',
      scannedHash: reqData.scannedHash ? reqData.scannedHash : '',
      gtinKey: reqData.gtin ? reqData.gtin : '',
      batchNo: reqData.batchNo ? reqData.batchNo : '',
      serialNo: reqData.serialNo ? reqData.serialNo : '',
      ip: this.reqIP,
      appMode: reqData.appMode ? reqData.appMode : '',
      productName: product?.name,
      gtin: gtin?._id,
      batch: batch?._id,
      product: product._id,
      dateOfBirth: reqData.dateOfBirth,
      anniversaryDate: reqData.anniversaryDate ? reqData.anniversaryDate : '',
      phone: reqData.phone ? reqData.phone : '',
      userName: reqData.userName,
      email: reqData.email,
      details: reqData.details,
    };

    // add user related data if req came by auth
    if (reqData.userProfile && !reqData.userName && !reqData.email) {
      feedbackData.userId = reqData.userProfile?.id;
      feedbackData.userName = reqData.userProfile?.user.givenName;
      feedbackData.email = reqData.userProfile?.email;
    }
    // add location if user provided lat and lon
    if (reqData.lat && reqData.lon) {
      const location = await this.geoCoder.getLoc({
        lat: reqData.lat,
        lon: reqData.lon,
      });
      feedbackData.location = location;
    }
    const feedback = await Feedback.create(feedbackData);
    // send email to user who created feedback
    this.emailGeneratorService
      .send({
        type: EmailType.FEEDBACK_CUSTOMER_EMAIL,
        email: reqData?.email,
        name: reqData?.userName,
        fillerData: reqData,
      })
      .catch((err: any) => {
        log.error(
          `error in sending feedback customer email for ${reqData.email} , errMsg: ${err.message}`,
        );
      });
    return feedback;
  }
}
