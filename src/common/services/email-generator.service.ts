/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import {ApplicationGatewayClient} from '@/clients/rest/application-gatewat.client';
import {PowerpuffClient} from '@/clients/rest/powerpuff.client';
import {log} from '@/utils';
import moment from 'moment';

import {
  bind,
  /* inject, */ BindingScope,
  inject,
  service,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {AssetCatalogueModuleService} from '@vlinder-be/asset-catalogue-module/dist/module/services/module.service';
//@ts-ignore
import {createEmail} from '@vlinder-be/mail-template-widget-node';
import _ from 'lodash';
import {v4} from 'uuid';
import {DashboardTable} from '../modules/dashboardTable/dashboardTable.model';
import {EmailTemplate} from '../modules/email-template/email-template.model';

export enum EmailType {
  ADMIN_INVITATION = 'ADMIN_INVITATION',
  SIGN_UP = 'SIGN_UP',
  HOLDER_INVITATION = 'HOLDER_INVITATION',
  CREDENTIAL_ISSUED = 'CREDENTIAL_ISSUED',
  ASSET_TRANSFERRED_MINTER = 'ASSET_TRANSFERRED_MINTER',
  FEEDBACK_CUSTOMER_EMAIL = 'FEEDBACK_CUSTOMER_EMAIL',
}

export enum EmailPropType {
  'title' = 'title',
  'avatar' = 'avatar',
  'paragraph' = 'paragraph',
  'newline' = 'newline',
  'ruler' = 'ruler',
  'social-icon' = 'social-icon',
  'footer' = 'footer',
  'anchor-button' = 'anchor-button',
  'store' = 'store',
  'property-list' = 'property-list',
  'status-light' = 'status-light',
  'statistics' = 'statistics',
}

export interface AssetTxnFillerData {
  store?: {
    logo: string;
    name: string;
    webLink?: string;
    contactUs?: string;
  };
  txn?: {
    disp_tx_id: string;
    asset: {
      name: string;
      creator: {
        name: string;
        address: string;
        credit: string;
        privacyUrl?: string;
        termsUrl?: string;
        facebookUrl?: string;
        twitterUrl?: string;
        instagramUrl?: string;
        linkedInUrl?: string;
      };
      img: string;
      price: string; // 5 MATIC or 455 USD
      platformCharge: string; // platformFee + brokerageFee
    };
    url: string;
    date: string; // order date
  };
}

@bind({scope: BindingScope.SINGLETON})
export class EmailGeneratorService {
  private isDetailsKeysWithoutNull: any[];
  constructor(
    @inject('config.defaultConfig')
    private defaultConfig: any,
    @inject('mailer.config') private mailConfig: any,
    @inject('feedbackMailer.config') private feedbackMailConfig: any,
    @inject('services.PowerpuffClient')
    private powerPuffClient: PowerpuffClient,
    @inject('services.ApplicationGatewayClient')
    private applicationGatewayClient: ApplicationGatewayClient,
    @service(AssetCatalogueModuleService)
    private assetCatalogueService: AssetCatalogueModuleService,
    @inject('env')
    private env: any,
    @inject('ORG_ID') private orgId: string,
  ) {}

  public async send({
    type,
    email,
    name,
    verifyToken,
    fillerData,
  }: {
    type: EmailType;
    email: string;
    name?: string;
    verifyToken?: string;
    fillerData?: any;
  }) {
    const {from, html, subject, to, cc, bcc} = await this.getEmailData({
      type,
      email,
      name,
      verifyToken,
      fillerData,
    });

    const emailContainer: any = {
      data: {
        name: 'SES',
        uid: v4(),
        data: {
          from,
          to,
          cc,
          bcc,
          subject: (_.isString(subject) && subject) || '',
          html,
        },
      },
    };

    try {
      const ret = await this.powerPuffClient.mailNow(emailContainer);
      // save email lookup data
      this.applicationGatewayClient
        .addEmailLookup({
          email: email,
          org: this.orgId,
        })
        .catch((err: any) => {
          log.error(
            `error in email lookup creation ${email} , errMsg: ${err.message}`,
          );
        });

      log.info(' emailGeneration service, email response =>', {
        emailDetails: _.set(
          emailContainer,
          'data.data.html',
          !!emailContainer?.data?.data?.html,
        ),
      });
      return ret;
    } catch (err: any) {
      log.warn('emailGeneration service, error sending email', {
        msg: err.message,
        emailDetails: _.set(
          emailContainer,
          'data.data.html',
          !!emailContainer?.data?.data?.html,
        ),
      });
    }
  }

  private async getEmailData({
    type,
    email,
    name,
    verifyToken,
    fillerData,
  }: {
    type: EmailType;
    email: string;
    name?: string;
    verifyToken?: string;
    fillerData?: any;
  }) {
    const from =
      type == EmailType.FEEDBACK_CUSTOMER_EMAIL
        ? this.feedbackMailConfig.from
        : this.mailConfig.from;
    const to = [email];
    const cc =
      type == EmailType.FEEDBACK_CUSTOMER_EMAIL
        ? this.feedbackMailConfig.cc
        : '';
    const bcc =
      type == EmailType.FEEDBACK_CUSTOMER_EMAIL
        ? this.feedbackMailConfig.bcc
        : '';

    const {subject, html} = await this.getSubjectAndHtml({
      type,
      email,
      name,
      verifyToken,
      fillerData,
    });
    return {to, from, subject, html, cc, bcc};
  }

  private async getSubjectAndHtml({
    type,
    email,
    name,
    verifyToken,
    fillerData,
  }: {
    type: EmailType;
    email: string;
    name?: string;
    verifyToken?: string;
    fillerData?: any;
  }) {
    //get Template from db
    const temp = await EmailTemplate.findOne({type});
    if (!temp)
      throw new HttpErrors.UnprocessableEntity(
        `email template not found by type:${type}`,
      );

    const subject = temp?.subject;
    const _union: any = [];
    switch (type) {
      case EmailType.ADMIN_INVITATION: {
        const salutationFiller = {
          name,
        };
        const verificationLink = `${this.mailConfig?.invitationURL}/auth/basic/verify_email/${email}/${verifyToken}?org-id=${this.orgId}`;

        for (const com of temp?.template?.data) {
          if (com?.filler || com?.link) {
            switch (com?.id) {
              case 'salutation':
                com.filler = {...salutationFiller};
                com.paragraph = [`Hello ${name},`];
                break;
              case 'action':
                com.link = verificationLink;
                break;
              default:
                log.warn(`static filler data ${com?.id}`);
            }
          }
        }

        break;
      }

      case EmailType.FEEDBACK_CUSTOMER_EMAIL:
        await this.loadFeedbackTableColDef();
        temp.template.data = this.fillAssetTransferEmailTemplate({
          emailTmpl: temp?.template.data,
          args: fillerData,
        });
        break;

      default:
        throw new HttpErrors[500](`email type not supported ${type}`);
    }
    const html = await createEmail([...temp?.template?.data], {
      ...temp?.template?.styleGuide,
    });

    return {subject, html};
  }

  private fillAssetTransferEmailTemplate({
    emailTmpl = [], //email template
    args, // object containing all dynamic data
  }: {
    emailTmpl?: any[];
    args?: any;
  }) {
    const _union: any = [];
    for (const [index, segment] of emailTmpl.entries()) {
      switch (segment?.id) {
        case 'marketplace-logo':
          segment.filler = {
            logo: args?.store?.logo ?? '',
          };
          _union.push(segment);
          break;
        case 'salutation':
          segment.filler = {
            name: args?.userName,
          };
          _union.push(segment);
          break;
        case 'content':
          segment.filler = {
            marketplaceTitle: `<${args?.store?.name}>`,
          };
          segment.filler[args?.store?.name as string] = args?.store?.webLink;
          _union.push(segment);
          break;
        case 'assetImage':
          if (args?.txn?.asset?.img) {
            segment.filler = {
              tokenUri: args?.txn?.asset?.img,
            };
            _union.push(segment);
          }
          break;

        case 'transaction-proof':
          segment.filler = {
            txUrl: args?.txn?.txUrl,
          };
          _union.push(segment);
          break;

        case 'asset-purchase-list':
          segment.filler = {};
          if (args?.userName) segment.filler.name = args?.userName;
          else segment.filler.name = 'NA';
          if (args?.email) segment.filler.email = args?.email;
          else segment.filler.email = 'NA';
          if (args?.dateOfBirth)
            segment.filler.dob = moment(args?.dateOfBirth).format('DD/MM/YYYY');
          else segment.filler.dob = 'NA';
          if (args?.anniversaryDate)
            segment.filler.anniversaryDate = moment(
              args?.anniversaryDate,
            ).format('DD/MM/YYYY');
          else segment.filler.anniversaryDate = 'NA';
          if (args?.phone) segment.filler.contactNumber = args?.phone;
          else segment.filler.contactNumber = 'NA';
          if (args?.rating) segment.filler.stars = args?.rating;
          else segment.filler.stars = 'NA';
          if (args?.comments) segment.filler.purchaserWallet = args?.comments;
          else segment.filler.purchaserWallet = 'NA';

          // add dynamica keys for org

          this.isDetailsKeysWithoutNull.map(key => {
            if (args?.details?.hasOwnProperty(key)) {
              segment.filler[key] = args?.details[key] || 'NA';
            }
          });
          // if (args?.details?.voucher)
          //   segment.filler.voucher = args?.details?.voucher;
          // else segment.filler.voucher = 'NA';

          _union.push(segment);
          break;
        case 'regards':
          segment.filler = {
            marketplaceName: args?.store?.name,
          };
          _union.push(segment);
          break;
        case 'footer':
          segment.filler = {
            ...this.mailConfig?.org,
            ...segment?.filler,
          };
          _union.push(segment);
          break;
        case 'disclaimer': {
          const filler = {
            marketplaceContactUs: this.mailConfig?.contactEmail,
          };
          segment.filler = {
            ...filler,
            ...segment?.filler,
          };
          _union.push(segment);
          break;
        }

        default:
          _union.push(segment);
          break;
      }
    }
    return _union;
  }

  private async getTableMetadata(key: string) {
    // moving this from private to public, we are using it in multiple services.
    const tableMetadata = await DashboardTable.findOne({key}).lean();
    if (!tableMetadata) {
      log.error(`CRITICAL: Table metadata not found for ${key}`);
      throw new HttpErrors.InternalServerError(`Oops! , something went wrong`);
    }
    return {tableMetadata};
  }

  private async loadFeedbackTableColDef() {
    // get the dynamic feedback keys from column defs
    const tableMetadataFeedback: any = await this.getTableMetadata('Feedback');

    const isDetailsKeys: any =
      tableMetadataFeedback.tableMetadata.columnDefs.map(
        (obj: {header: any; isDetails: any; accessor: any}) => {
          if (obj?.isDetails) {
            return obj?.accessor;
          }
          return null;
        },
      );
    const isDetailsKeysWithoutNull = isDetailsKeys.filter((element: null) => {
      return element !== null;
    });
    this.isDetailsKeysWithoutNull = isDetailsKeysWithoutNull;
  }
}
