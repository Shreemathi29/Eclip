/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {FullProvenanceCommonService} from '@/common/modules/fullProvenance/fullProvenance.common.service';
import {ProvSuggestionsCommonService} from '@/common/modules/fullProvenance/provSuggestions.common.service';
import {FullProvenanceCommonServiceV2} from '@/common/modules/fullProvenanceV2/fullProvenanceV2.common.service';
import {TOSLogCommonService} from '@/common/modules/tos-log/tos.common.service';
import {CommonBindings} from '@/common/request-context/common-bindings';
import {getServiceName} from '@/utils/loopbackUtils';
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
  CREATE_TOS_REQUEST,
  CREATE_TOS_RESPONSE,
  GET_FULL_PROVENANCE_REQUEST,
  GET_FULL_PROVENANCE_RESPONSE,
  GET_PRODUCT_CRED_REQUEST,
  GET_PRODUCT_CRED_RESPONSE,
  GET_STEP_CRED_BULK_REQUEST,
  GET_STEP_CRED_BULK_RESPONSE,
  GET_STEP_CRED_REQUEST,
  GET_STEP_CRED_RESPONSE,
} from './provenance.openapi';

const useragent = require('useragent');
@oas.visibility(apiVisibility)
export class ProvenanceController {
  constructor(
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @service(ProvSuggestionsCommonService)
    private provSuggestionsCommonService: ProvSuggestionsCommonService,
  ) {}

  @post('/provenance/full_provenance/with_auth', {
    responses: {
      '200': GET_FULL_PROVENANCE_RESPONSE,
    },
  })
  async getFullProvenanceWithAuth(
    @requestBody(GET_FULL_PROVENANCE_REQUEST) reqBody: any,
  ) {
    return this.getFullProvService().getFullProvenance(reqBody);
  }

  @post('/provenance/full_provenance/no_auth', {
    responses: {
      '200': GET_FULL_PROVENANCE_RESPONSE,
    },
  })
  async getFullProvenancWithoutAuth(
    @requestBody(GET_FULL_PROVENANCE_REQUEST) reqBody: any,
  ) {
    return this.getFullProvService().getFullProvenance(reqBody);
  }

  @post('/provenance/full_provenance_v2/with_auth', {
    responses: {
      '200': GET_FULL_PROVENANCE_RESPONSE,
    },
  })
  async getFullProvenanceV2WithAuth(
    @requestBody(GET_FULL_PROVENANCE_REQUEST) reqBody: any,
  ) {
    return this.getFullProvServiceV2().getFullProvenanceV2(reqBody);
  }

  @post('/provenance/full_provenance_v2/no_auth', {
    responses: {
      '200': GET_FULL_PROVENANCE_RESPONSE,
    },
  })
  async getFullProvenancV2WithoutAuth(
    @requestBody(GET_FULL_PROVENANCE_REQUEST) reqBody: any,
  ) {
    return this.getFullProvServiceV2().getFullProvenanceV2(reqBody);
  }

  @post('/provenance/full_provenance/suggestions', {
    responses: {
      '200': GET_FULL_PROVENANCE_RESPONSE,
    },
  })
  async getFullProvSuggestions(
    @requestBody(GET_FULL_PROVENANCE_REQUEST) reqBody: any,
  ) {
    return this.provSuggestionsCommonService.getFullProvSuggestions(reqBody);
  }

  @post('/vlinder-core/tos/no_auth', {
    responses: {'200': CREATE_TOS_RESPONSE},
  })
  async createTOSLogWithoutAuth(@requestBody(CREATE_TOS_REQUEST) param: any) {
    // add user-agent in params
    param.user_agent = useragent.lookup(this.req.headers['user-agent']);

    const ret = await (
      await this.getTOSCommonService()
    ).createTOSLogWithoutAuth(param);
    return ret;
  }

  @post('/vlinder-core/tos/with_auth', {
    responses: {'200': CREATE_TOS_RESPONSE},
  })
  async createTOSLogWithAuth(@requestBody(CREATE_TOS_REQUEST) param: any) {
    // add user-agent in params
    param.user_agent = useragent.lookup(this.req.headers['user-agent']);

    const ret = await (
      await this.getTOSCommonService()
    ).createTOSLogWithAuth(param);
    return ret;
  }

  @post('/provenance/step_cred/no_auth', {
    responses: {
      '200': GET_STEP_CRED_RESPONSE,
    },
  })
  async getProvenanceStepCredWithoutAuth(
    @requestBody(GET_STEP_CRED_REQUEST) reqBody: any,
  ) {
    return this.getFullProvService().getProvenanceStepCred(reqBody);
  }

  @post('/provenance/step_cred_bulk/no_auth', {
    responses: {
      '200': GET_STEP_CRED_BULK_RESPONSE,
    },
  })
  async getProvenanceStepCredBulkWithoutAuth(
    @requestBody(GET_STEP_CRED_BULK_REQUEST) reqBody: any,
  ) {
    return this.getFullProvServiceV2().getProvStepCreds(reqBody);
  }

  @post('/provenance/step_cred_bulk/with_auth', {
    responses: {
      '200': GET_STEP_CRED_BULK_RESPONSE,
    },
  })
  async getProvenanceStepCredBulkWithAuth(
    @requestBody(GET_STEP_CRED_BULK_REQUEST) reqBody: any,
  ) {
    return this.getFullProvServiceV2().getProvStepCreds(reqBody);
  }

  @post('/provenance/step_cred/with_auth', {
    responses: {
      '200': GET_STEP_CRED_RESPONSE,
    },
  })
  async getProvenanceStepCredWithAuth(
    @requestBody(GET_STEP_CRED_REQUEST) reqBody: any,
  ) {
    return this.getFullProvService().getProvenanceStepCred(reqBody);
  }

  @post('/provenance/product_cred/no_auth', {
    responses: {
      '200': GET_PRODUCT_CRED_RESPONSE,
    },
  })
  async verifyItemCredWithoutAuth(
    @requestBody(GET_PRODUCT_CRED_REQUEST) reqBody: any,
  ) {
    return this.getFullProvService().verifyItemCred(reqBody);
  }

  @post('/provenance/product_cred/with_auth', {
    responses: {
      '200': GET_PRODUCT_CRED_RESPONSE,
    },
  })
  async verifyItemCredWithAuth(
    @requestBody(GET_PRODUCT_CRED_REQUEST) reqBody: any,
  ) {
    return this.getFullProvService().verifyItemCred(reqBody);
  }

  private getFullProvService() {
    return this.reCtx.getSync(
      getServiceName(FullProvenanceCommonService),
    ) as FullProvenanceCommonService;
  }

  private getFullProvServiceV2() {
    return this.reCtx.getSync(
      getServiceName(FullProvenanceCommonServiceV2),
    ) as FullProvenanceCommonServiceV2;
  }

  private getTOSCommonService() {
    return this.reCtx.getSync(
      getServiceName(TOSLogCommonService),
    ) as TOSLogCommonService;
  }
}

// after full provdennace cover product and step cred - change endpoint names only and check email for user
