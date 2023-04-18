/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {WalletClient} from '@/clients/rest/wallet.client';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {EmailGeneratorService, EmailType} from '@/common/services';
import {OrganizationService} from '@/domain-services';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Context} from 'vm';
import {IUser} from '../users/user.model';
import {Holder, HolderStatus} from './holder.model';

export class HolderCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.WalletClient') private walletClient: WalletClient,
    @inject('services.OrganizationService')
    private orgService: OrganizationService,
    @inject('services.EmailGeneratorService')
    private emailGeneratorService: EmailGeneratorService,
  ) {
    super(ctx);
  }

  @authAndAuthZ('read', 'Holder')
  async getHolders({
    // did,
    skip = 0,
    limit = 50000,
  }: {
    // did: string;
    skip: number;
    limit: number;
  }) {
    const holders = await Holder.find().skip(skip).limit(limit);
    return holders;
  }

  @authAndAuthZ('read', 'Holder')
  async inviteHolder({
    userProps,
    sendInvitationEmail = true,
  }: {
    userProps: Pick<IUser, 'email' | 'givenName' | 'familyName' | 'image'>;
    sendInvitationEmail: boolean;
  }) {
    const email = userProps.email;
    const org = await this.orgService.getMyOrg();
    const ret = await this.walletClient.subscribeUsers({
      did: org.did as string,
      emails: [email],
    });

    const holder = await Holder.findOneAndUpdate(
      {email: userProps.email},
      {$setOnInsert: {...userProps, status: HolderStatus.NOT_INVITED}},

      {upsert: true, new: true},
    );

    if (sendInvitationEmail) {
      const emailRet = await this.emailGeneratorService.send({
        type: EmailType.HOLDER_INVITATION,
        email,
      });

      const holder = await Holder.findOneAndUpdate(
        {email: userProps.email, status: {$ne: HolderStatus.WALLET_REGISTERED}},
        {status: HolderStatus.INVITED},
      );
      return 'email initiated';
    }
    return 'user subscribed';
  }

  // ----------no-Auth------------------------------------------------------

  async getHolderFromWalletOrLocal({
    client_id,
    emailordid,
    isWalletRegMandatory = false,
  }: {
    client_id: string;
    emailordid: string;
    isWalletRegMandatory?: boolean;
  }) {
    if (!emailordid)
      throw new HttpErrors.InternalServerError(
        'getHolderFromWalletOrLocal => emailordid not provided',
      );
    const holders = await this.walletClient.getUsersByEmailOrDID({
      client_id,
      entries: [emailordid],
    });
    let holder = holders?.[0];
    if (!holder && isWalletRegMandatory)
      throw new HttpErrors.UnprocessableEntity(
        `wallet is not registered for user ${emailordid}`,
      );
    if (!holder) holder = await Holder.findOne({email: emailordid});
    if (!holder)
      throw new HttpErrors.NotFound(`Holder: ${emailordid} not found.`);

    return holder;
  }

  async makeHolderRegistered({email}: {email: string}) {
    const holder = await Holder.findOneAndUpdate(
      {email},
      {status: HolderStatus.WALLET_REGISTERED},
      {new: true},
    );

    return holder;
  }
}
