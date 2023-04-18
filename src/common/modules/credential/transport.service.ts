/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {PowerpuffClient} from '@/clients/rest/powerpuff.client';
import {log, pretty} from '@/utils/logging';
import {bind, BindingScope, inject, service} from '@loopback/core';
import {IBrand} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
// @ts-ignore
import camelcase from 'camelcase';
import _ from 'lodash';
import {v4} from 'uuid';
import {
  HolderFromDIDOrEmail,
  WalletClient,
} from '../../../clients/rest/wallet.client';

@bind({scope: BindingScope.TRANSIENT})
export class TransportService {
  tag: String;
  user: HolderFromDIDOrEmail;
  issuerOrg: IBrand;
  sendEmail: boolean;
  sendPN: boolean;
  private emailContainer: any;
  private pnContainer: {data: any};

  constructor(
    {
      tag,
      holder,
      issuerOrg,
      sendEmail = false,
      sendPN = false,
    }: {
      tag: string;
      holder: HolderFromDIDOrEmail;
      issuerOrg: IBrand;
      sendEmail: boolean;
      sendPN: boolean;
    },
    @inject('config.coreConfig') private coreConfig: any,
    @service(WalletClient) private walletClient: WalletClient,
    @service(PowerpuffClient) private powerPuffClient: PowerpuffClient,
  ) {
    this.tag = tag;
    this.issuerOrg = issuerOrg;
    this.sendEmail = sendEmail;
    this.sendPN = sendPN;
    this.user = holder;
  }

  async initiateTransportAsync() {
    this.addPN();
    const ret = await this.send();
    log.info(`is email requested ${this.sendEmail}`, {
      emailreq: {tag: this.tag, userEmail: this.user.email},
    });
    //this.updateCredentialDb();
    return ret;
  }

  initiateTransportSync() {
    this.initiateTransportAsync()
      .then(x => {
        log.info('transport result', {
          ispnInitiated: !!this.pnContainer,
          ismailInitiated: !!this.emailContainer,
        });
      })
      .catch(err => {
        log.error(`error during transport ${err.message}`);
      });
  }

  private async send() {
    if (this.emailContainer)
      this.powerPuffClient
        .mailNow(this.emailContainer)
        .then(x => {
          log.info(`Email for ${this.user?.email} initiated`);
        })
        .catch(err => {
          log.error(`Error while sending email:${this.user?.email}`);
        });

    if (this.pnContainer)
      this.powerPuffClient
        .pushNotificationNow(this.pnContainer)
        .then(x => {
          log.info(
            `Pn for ${this.user?.email} initiated. PushTokens: ${pretty(
              this.user.pushTokens?.map(y => y.token),
            )}`,
          );
        })
        .catch(err => {
          log.error(
            `Error while sending PN for email:${
              this.user?.email
            } PushTokens: ${pretty(this.user.pushTokens?.map(y => y.token))}`,
          );
        });
  }

  public addPN() {
    if (_.isEmpty(this.user.pushTokens)) {
      log.warn('pushtoken empty');
      return;
    }

    let fromOrg = '';
    const url = this.formPNURL();
    if (this.issuerOrg?.name) fromOrg = ` from ${this.issuerOrg?.name}`;
    const titlePrefix = 'New credential';
    //TODO get type of crdential from monarcha
    //this.tag.type === 'SDR' ? 'Share Request' : `New credential`;
    const pnContainer = {
      data: {
        name: this.user.pushTokens?.[0]?.token.includes('expo')
          ? 'expo'
          : ('firebase' as 'expo' | 'firebase'),
        data: [
          {
            to: this.user.pushTokens?.map(x => x.token),
            body: JSON.stringify({
              url,
            }),
            title: titlePrefix + fromOrg,
          },
        ],
        uid: v4(),
      },
    };
    this.pnContainer = pnContainer;
  }

  public addEmail({
    from,
    cc,
    subject,
    pdf,
    fileNameWithoutExt,
    html,
  }: {
    from: string;
    cc: string[];
    subject: string;
    pdf?: string;
    fileNameWithoutExt: string;
    html: string;
  }) {
    if (this.sendEmail) {
      const givenName = this.user.givenName ?? '';
      const familyName = this.user.familyName ?? '';
      const fileName = givenName + (familyName ? '_' : '') + familyName;

      const emailContainer: any = {
        data: {
          name: 'SES',
          uid: v4(),
          data: {
            from,
            to: this.user.email,
            //cc: (Array.isArray(cc) && cc) || [],
            subject: (_.isString(subject) && subject) || '',
            html,
            // bcc: [],
          },
        },
      };

      if (pdf) {
        emailContainer.data.data.attachments = [
          {
            filename:
              camelcase(fileName || fileNameWithoutExt || 'Certificate', {
                pascalCase: true,
              }) + '.pdf',
            content: pdf,
            encoding: 'base64',
            contentType: 'application/pdf',
          },
        ];
      }

      this.emailContainer = emailContainer;
    }
  }

  // private async savePushNotification() {
  //   //save notification
  //   const urlString = this.pnContainer.data.data.body as string;

  //   if (urlString) {
  //     await this.walletClient
  //       .savePushNotification({
  //         email: this.user.email,
  //         fromOrg: this.issuerOrg?.name as string,
  //         vertical: this.coreConfig.verticalName,
  //         networkOperatorKey: this.coreConfig.networkOperatorName,
  //         //type: this.tag.type === 'SDR' ? 'Share Request' : 'New Credential',
  //         credTag: this.tag,
  //         url: JSON.parse(urlString).url,
  //       })
  //       .then(x => {
  //         log.info(`save notification successfully triggered`);
  //       })
  //       .catch(err => {
  //         log.error(
  //           `error at saveNotification email: ${this?.user?.email} ,${err.message}`,
  //         );
  //       });
  //   }
  // }

  private formPNURL() {
    const url = `${this.coreConfig.tagURL}?tag=${this.tag}&nop=${this.issuerOrg.nameKey}&vc=${this.coreConfig.verticalName}`;
    log.info(`PN url => ${url}`);
    return url;
  }
}
