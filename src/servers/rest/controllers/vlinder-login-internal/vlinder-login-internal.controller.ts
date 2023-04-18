/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {VlinderLoginCommonService} from '@/common/modules/users/vlinder-login.service';
import {inject, service} from '@loopback/core';
import {
  oas,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {apiVisibility} from '../../openapi';
import {
  CREATE_USER_REQUEST,
  CREATE_USER_RESPONSE,
  EDIT_USER_REQUEST,
  EDIT_USER_RESPONSE,
  GET_USER_BY_EMAIL_REQUEST,
  GET_USER_BY_EMAIL_RESPONSE,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_RESPONSE,
  SIGNIN_REQUEST,
  SIGNIN_RESPONSE,
} from './vlinder-login-internal.openapi';

@oas.visibility(apiVisibility)
export class VlinderLoginInternalController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @service(VlinderLoginCommonService)
    private vlnLoginServ: VlinderLoginCommonService,
  ) {}

  @post('/auth/user/get-by-id', {
    responses: {'200': GET_USER_BY_ID_RESPONSE},
  })
  async getUserById(@requestBody(GET_USER_BY_ID_REQUEST) param: any) {
    const ret = await this.vlnLoginServ.getUserById(param);
    return {
      user: ret,
    };
  }

  @post('/auth/user/get-by-email', {
    responses: {'200': GET_USER_BY_EMAIL_RESPONSE},
  })
  async getUserByEmail(@requestBody(GET_USER_BY_EMAIL_REQUEST) param: any) {
    const ret = await this.vlnLoginServ.getUserByEmail(param);
    return {
      user: ret,
    };
  }

  @post('/auth/user/create', {
    responses: {'200': CREATE_USER_RESPONSE},
  })
  async createUser(@requestBody(CREATE_USER_REQUEST) param: any) {
    const ret = await this.vlnLoginServ.createUser(param);
    return {
      user: ret,
    };
  }

  @post('/auth/user/edit', {
    responses: {'200': EDIT_USER_RESPONSE},
  })
  async editUser(@requestBody(EDIT_USER_REQUEST) param: any) {
    const ret = await this.vlnLoginServ.editUser(param);
    return {
      user: ret,
    };
  }

  @post('/auth/user/signin', {
    responses: {'200': SIGNIN_RESPONSE},
  })
  async signIn(@requestBody(SIGNIN_REQUEST) param: any) {
    const ret = await this.vlnLoginServ.signIn(param);
    return ret;
  }
}
