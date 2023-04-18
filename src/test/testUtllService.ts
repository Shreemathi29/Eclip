/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {VApplication} from '@/application';
import {VlinderLoginCommonService} from '@/common/modules/users/vlinder-login.service';
import {CommonRequestContext} from '@/common/request-context/request-context';
import {ClientService} from '@/domain-services/client.service';
import {bind, BindingScope, CoreBindings, inject} from '@loopback/core';
import {Context} from 'vm';

@bind({scope: BindingScope.SINGLETON})
export class TestUtilService {
  constructor(
    @inject.context() protected ctx: Context,
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: VApplication,
  ) {}

  private getReqCtx() {
    const reCtx = new CommonRequestContext(this.app, {});
    return reCtx;
  }

  async getTestReqCtx() {
    // Get access token using email
    const env = this.app.getEnv();
    const vlnLoginServ: any = this.app.getSync(
      'services.VlinderLoginCommonService',
    ) as VlinderLoginCommonService;
    const signInRes = await vlnLoginServ.signIn({
      email: env.SIGNIN_EMAIL,
    });
    // Get access token using clint id and secret
    const clientService = this.getReqCtx().getSync(
      'services.ClientService',
    ) as ClientService;
    const getAccessTokenRes = await clientService.getAccessToken({
      client_id: env.CLIENT_ID,
      secret: env.SECRET,
    });

    const reCtx = new CommonRequestContext(this.app, {
      jwt: signInRes.accessToken,
      request: {
        body: {
          access_token: getAccessTokenRes.access_token,
          client_id: env.CLIENT_ID,
        },
      },
    });
    return reCtx;
  }
}
