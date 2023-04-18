/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {CommonBindings} from '@/common/request-context/common-bindings';
import {CredentialService} from '@/domain-services';
import {getServiceName} from '@/utils/loopbackUtils';
import {inject} from '@loopback/core';
import {get, oas, param, Request, Response, RestBindings} from '@loopback/rest';
import {apiVisibility} from '../../openapi';

@oas.visibility(apiVisibility)
export class CredentialExternalViewController {
  constructor(
    @inject(CommonBindings.COMMON_REQ_CTX) private reqCtx: any,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response, // @service(CredentialService) private credServ: CredentialService,
  ) {}

  @get('/credentials/{externalId}/{tag}')
  async verifyCredentialExternalView(
    @param.path.string('externalId') externalId: string,
    @param.path.string('tag') tag: string,
  ) {
    const credServ = this.reqCtx.getSync(
      getServiceName(CredentialService),
    ) as CredentialService;
    const ret = await credServ.verifyCredentialExternalView({tag});
    return ret;
  }
}
