/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {CredTranCommonService} from '@/common/modules/credentialTransactions/credentialTransaction.common.service';
import {CommonBindings} from '@/common/request-context/common-bindings';
import {getServiceName} from '@/utils/loopbackUtils';
import {inject} from '@loopback/context';
import {
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {
  CREATE_CRED_TRAN_REQUEST,
  CREATE_CRED_TRAN_RESPONSE,
} from './credential-transaction.openapi';

export class CredTranController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any, // @service(CredTranCommonService) // private credTranService: CredTranCommonService,
  ) {}

  @post('/cred-tran/create', {
    responses: {
      '200': CREATE_CRED_TRAN_RESPONSE,
    },
  })
  async createCredTran(@requestBody(CREATE_CRED_TRAN_REQUEST) reqData: any) {
    return this.getCredTranCommonService().createCredTran(reqData);
  }

  // ----------------------------------------------
  private getCredTranCommonService() {
    return this.reCtx.getSync(
      getServiceName(CredTranCommonService),
    ) as CredTranCommonService;
  }
}
