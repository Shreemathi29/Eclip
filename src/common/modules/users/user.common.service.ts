/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {KlefkiLoginClient} from '@/clients/rest/klefki-login.client';
import {WalletClient} from '@/clients/rest/wallet.client';
import {
  authAndAuthZ,
  authenticateMethod,
} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {EmailGeneratorService, EmailType} from '@/common/services';
import {OrganizationService} from '@/domain-services';
import {log, pretty} from '@/utils';
import {inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Brand} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import _ from 'lodash';
import {Context} from 'vm';
import {Role} from '../role/role.model';
import {IUser, User, UserProfile} from './user.model';

interface IEditUserRequest {
  email: string;
  givenName?: string | null;
  familyName?: string | null;
  telephone?: string | null;
  image?: string | null;
  roleId?: string | null;
  accessForbidden?: boolean | null;
}

export class UserCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.WalletClient') private walletClient: WalletClient,
    @inject('services.OrganizationService')
    private orgService: OrganizationService,
    @inject('services.EmailGeneratorService')
    private emailGeneratorService: EmailGeneratorService,
    @service(KlefkiLoginClient) private klefkiLoginClient: KlefkiLoginClient,
  ) {
    super(ctx);
  }

  @authAndAuthZ('read', 'User')
  async createCoreUser({
    currentUser,
    userProps,
    roleId,
    sendInvitationEmail = true,
  }: {
    currentUser: UserProfile;
    userProps: Pick<IUser, 'email' | 'givenName' | 'familyName' | 'image'>;
    roleId: string;
    sendInvitationEmail: boolean;
  }) {
    // const accessUser = this.getAccessUser();

    const _user = await User.findOne({email: userProps.email});
    if (_user)
      throw new HttpErrors[400](`user already exist, email:${userProps.email}`);
    //user's feature
    const role = await Role.findOne({_id: roleId});
    const user = await User.create({
      ...userProps,
      role: role?._id,
      // organization: creator.organization,
      // creator: creator._id,
      isInviEmailSent: sendInvitationEmail,
    });
    // ------------------------------------------
    const ret = await this.klefkiLoginClient.generateEmailVerifyToken({
      owner: user._id,
    });
    // -------------------------------------------

    this.emailGeneratorService
      .send({
        type: EmailType.ADMIN_INVITATION,
        email: user.email,
        verifyToken: ret.token,
      })
      .catch((err: any) => {
        log.error(
          `error in sending admin invitation email for ${userProps.email} , errMsg: ${err.message}`,
        );
      });

    return user;
  }

  @authAndAuthZ('read', 'User')
  async resendAdminInvitation(email: string) {
    const user = await User.findOne({email});
    if (!user) throw new HttpErrors[400](`user not found, email:${email}`);

    const emailTokenRet = await this.klefkiLoginClient.generateEmailVerifyToken(
      {
        owner: user._id,
      },
    );
    this.emailGeneratorService
      .send({
        type: EmailType.ADMIN_INVITATION,
        email: user.email,
        verifyToken: emailTokenRet.token,
        name: user.givenName,
      })
      .then(x => {
        log.info(`successfully resent admin invi email for ${user.email}`);
      })
      .catch((err: any) => {
        log.error(
          `error in resending admin invitation email for ${user.email} msg: ${err.message}`,
        );
      });
    return 'Invitation Sent';
  }

  @authAndAuthZ('update', 'Role')
  @authAndAuthZ('update', 'User')
  async editUser({
    familyName,
    givenName,
    telephone,
    image,
    roleId,
    email,
    accessForbidden,
  }: IEditUserRequest) {
    const params: any = {};
    if (!_.isNil(familyName)) params.familyName = familyName;
    if (!_.isNil(givenName)) params.givenName = givenName;
    if (!_.isNil(telephone)) params.givenName = givenName;
    if (!_.isNil(image)) params.givenName = givenName;
    if (!_.isNil(accessForbidden)) params.accessForbidden = accessForbidden;
    if (!_.isNil(roleId)) {
      const accessUserEmail = (await this.getAccessUser())?.user?.email
        .toLowerCase()
        ?.trim();
      if (accessUserEmail === email?.toLowerCase()?.trim())
        throw new HttpErrors.BadRequest('You cannot edit your own role');
      // ---------------------------------
      const role = await Role.findById(roleId);
      if (!role)
        throw new HttpErrors.NotFound(`Role by Id ${roleId} not found`);

      params.role = role?._id;
    }

    const user = await User.findOneAndUpdate({email}, params, {new: true});
    if (!user)
      throw new HttpErrors.NotFound(`user not found for email ${email}`);
    log.info(
      `user successfully edited for email: ${email}, params ${pretty(params)}`,
    );
    return user;
  }

  @authAndAuthZ('create', 'User')
  async inviteUserByAdmin(userProps: any) {
    // first check user
    const user = await User.findOne({email: userProps.email});
    if (user)
      throw new HttpErrors[400](`user already exist, email:${userProps.email}`);
    // check role is valid or not
    const _role = await Role.findOne({_id: userProps.role});
    if (!_role) throw new HttpErrors[400](`Role not found`);
    // find logged in user and organization
    const accessUser = (await this.getAccessUser()).user as IUser;
    const org = await Brand.findOne({_id: accessUser?.organization});

    // create a user
    const createUser = await User.create({
      email: userProps.email,
      givenName: userProps.givenName,
      familyName: userProps.familyName,
      role: userProps.role,
      organization: org._id,
      creator: accessUser?._id,
    });
    if (createUser) {
      const emailVerificationToken =
        await this.klefkiLoginClient.generateEmailVerifyToken({
          owner: createUser._id,
        });

      this.emailGeneratorService
        .send({
          type: EmailType.ADMIN_INVITATION,
          email: userProps.email,
          verifyToken: emailVerificationToken.token,
          name: userProps.givenName,
        })
        .then(x => {
          log.info(`successfully sent admin invi email for ${userProps.email}`);
        })
        .catch((err: any) => {
          log.error(
            `error in sending admin invitation email for ${userProps.email} , errMsg: ${err.message}`,
          );
        });
    }
    return 'Invitation Sent';
  }

  @authenticateMethod
  async editMyself({
    familyName,
    givenName,
    telephone,
    image,
  }: IEditUserRequest) {
    const params: any = {};
    if (!_.isNil(familyName)) params.familyName = familyName;
    if (!_.isNil(givenName)) params.givenName = givenName;
    if (!_.isNil(telephone)) params.givenName = givenName;
    if (!_.isNil(image)) params.givenName = givenName;
    const accessUserEmail = (await this.getAccessUser())?.user?.email
      .toLowerCase()
      ?.trim();
    const user = await User.findOneAndUpdate({email: accessUserEmail}, params, {
      new: true,
    });

    log.info(
      `user successfully edited for email: ${accessUserEmail}, params ${pretty(
        params,
      )}`,
    );
    return user;
  }

  @authenticateMethod
  async getMyself() {
    return (await this.getAccessUser()).user;
  }

  public getFullName(user?: IUser | null | undefined) {
    if (!user?.familyName && !user?.givenName) return null;
    return ((user?.givenName ?? '') + ' ' + (user?.familyName ?? '')).trim();
  }
}
