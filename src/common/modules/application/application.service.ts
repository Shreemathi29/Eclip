/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {Identity, MonarchaClient} from '@/clients/rest/monarcha.client';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {DecodedJWTAndUser} from '@/common/request-context/decode-jwt.provider';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {OrganizationService} from '@/domain-services';
import {log} from '@/utils/logging';
import {DECODED_JWT_AND_USER} from '@common/request-context/common-bindings';
import {Context, inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Application, CreateApplicationInput} from './application.model';

export class ApplicationService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @service(OrganizationService)
    private organizationService: OrganizationService,
    @service(MonarchaClient)
    private monarchaClient: MonarchaClient,
    @inject(DECODED_JWT_AND_USER) private currentUser: DecodedJWTAndUser,
  ) {
    super(ctx);
  }

  @authAndAuthZ('create', 'Application')
  async createAppplication(params: CreateApplicationInput) {
    const {user, userOrg} = await this.getUserAndOrg();
    const provider = this.getProviderName(userOrg.did as string);
    if (!provider)
      throw new HttpErrors.InternalServerError(
        `providername from did for org ${userOrg.name} can't be determined`,
      );

    const identity: Identity = await this.monarchaClient.createIdentity({
      provider,
      alias: params.name,
    });
    if (!identity.did)
      throw new HttpErrors.InternalServerError(`unable to create identity`);

    const secretKey = await this.monarchaClient.getSecret({
      provider,
      alias: params.name,
    });
    const application = await Application.create({
      ...params,
      creator: user._id,
      client_id: identity.did,
    });
    // console.log('ap =>', application);
    log.info(`Application created => ${params.name}`, {
      createAppParams: params,
    });
    return {...application.toJSON(), secret_key: secretKey};
  }

  @authAndAuthZ('read', 'Application')
  async getApiApplication() {
    const {user, userOrg} = await this.getUserAndOrg();
    const provider = this.getProviderName(userOrg.did as string);
    if (!provider)
      throw new HttpErrors.InternalServerError(
        `providername from did for org ${userOrg.name} can't be determined`,
      );

    const appName = 'API Application';
    const secretKey = await this.monarchaClient.getSecret({
      provider,
      alias: 'API Application',
    });

    const application = await Application.findOne({name: appName});
    if (!application)
      throw new HttpErrors.NotFound('API Application not found');

    return {...application.toJSON(), secret_key: secretKey};
  }

  @authAndAuthZ('update', 'Application')
  async enableApplication(client_id: string) {
    const app = await Application.findOneAndUpdate(
      {client_id},
      {$set: {is_enabled: true}},
      {new: true},
    );
    if (!app?.is_enabled) {
      throw new HttpErrors.NotFound(`App not found client_id:${client_id}`);
    }
    return 'Application Enabled';
  }

  @authAndAuthZ('read', 'Application')
  async getApplications(offset: number, limit: number) {
    const applications = await Application.find({}).skip(offset).limit(limit);
    return applications;
  }

  @authAndAuthZ('read', 'Application')
  async getApplication({_id}: {_id: string}) {
    const application = await Application.findById(_id);
    if (!application)
      throw new HttpErrors.NotFound(`Application id: ${_id} not found`);
    return application;
  }

  @authAndAuthZ('update', 'Application')
  async editApplication({
    applicationId,
    input,
  }: {
    applicationId: String;
    input: any;
  }) {
    const application = await Application.findOneAndUpdate(
      {_id: applicationId},
      {
        ...input,
      },
    );
    if (!application) throw new HttpErrors.NotFound(`application not found`);
    return application;
  }

  //  -----------private ----------------------
  private async getUserAndOrg() {
    const user = this.currentUser.user;
    if (!user) throw new HttpErrors.NotFound(`user not found`);
    const userOrg = await this.organizationService.getMyOrg();
    if (!userOrg)
      throw new HttpErrors.NotFound(`user does not belong to any organization`);
    return {user, userOrg};
  }

  private getProviderName(did: string) {
    return did.slice(0, did.lastIndexOf(':'));
  }
}
