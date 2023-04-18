/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {ProvenanceCommonService} from '@/common/modules/provenance';
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
  CREATE_PROV_REQUEST,
  CREATE_PROV_RESPONSE,
  ISSUE_PROV_CRED_RESPONSE,
  ISSUE_PROV_DISPATCH_CRED_RESPONSE,
  PROV_DISPATCH_MAP_AND_ISSUE_STEP_CREDS,
  PROV_MAP_AND_ISSUE_STEP_CREDS,
  PROV_MAP_AND_ISSUE_STEP_CREDS_STEPS,
  UPDATE_PROV_REQUEST,
  UPDATE_PROV_RESPONSE,
} from './provenance.openapi';

export class ProvController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
  ) {}

  @post('/prov/create', {
    responses: {
      '200': CREATE_PROV_RESPONSE,
    },
  })
  async createProv(@requestBody(CREATE_PROV_REQUEST) reqData: any) {
    return this.getProvService().createProv(reqData);
  }

  @post('/prov/update', {
    responses: {
      '200': UPDATE_PROV_RESPONSE,
    },
  })
  async updateProv(@requestBody(UPDATE_PROV_REQUEST) reqData: any) {
    return this.getProvService().updateProv(reqData);
  }

  @post('/prov/step_creds/map_and_issue', {
    responses: {
      '200': ISSUE_PROV_CRED_RESPONSE,
    },
  })
  async mapAndIssueProvStepCreds(
    @requestBody(PROV_MAP_AND_ISSUE_STEP_CREDS) reqData: any,
  ) {
    return this.getProvService().issueProvCred(reqData);
  }

  @post('/prov/step_creds/map_and_issue_steps', {
    responses: {
      '200': ISSUE_PROV_CRED_RESPONSE,
    },
  })
  async mapAndIssueProvStepCredsSteps(
    @requestBody(PROV_MAP_AND_ISSUE_STEP_CREDS_STEPS) reqData: any,
  ) {
    return this.getProvService().issueProvCredSteps(reqData);
  }

  @post('/prov/dispatch/step_creds/map_and_issue', {
    responses: {
      '200': ISSUE_PROV_DISPATCH_CRED_RESPONSE,
    },
  })
  async mapAndIssueProvDispatchStepCreds(
    @requestBody(PROV_DISPATCH_MAP_AND_ISSUE_STEP_CREDS) reqData: any,
  ) {
    return this.getProvService().issueProvDispatchCred(reqData);
  }

  // ----------------------------------------------
  private getProvService() {
    return this.reCtx.getSync(
      getServiceName(ProvenanceCommonService),
    ) as ProvenanceCommonService;
  }
}
