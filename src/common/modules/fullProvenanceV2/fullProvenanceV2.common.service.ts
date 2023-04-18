/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {CommonBindings} from '@/common/request-context/common-bindings';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {GeocoderService} from '@/common/services/geocoder.service';
import {log} from '@/utils/logging';
import {bind, BindingScope, inject, service} from '@loopback/core';
import {Request} from 'express';
import {Context} from 'vm';
import {CredentialConfig} from '../credential';
import {DashboardTableCommonService} from '../dashboardTable/dashboardTable.common.service';
import {ProvSuggestionsCommonService} from '../fullProvenance/provSuggestions.common.service';
import {GetFullProvByTokenIdHelperV2} from './getFullProvByTokenIdV2.helper';
import {GetProvCredGlobalHelper} from './getProvCredGlobal.helper';
import {GetProvCredMainHelper} from './getProvCredMain.helper';

@bind({scope: BindingScope.SINGLETON})
export class FullProvenanceCommonServiceV2 extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('env') private env: any,
    @inject('config.credential') private credentialConfig: CredentialConfig,
    @service(GeocoderService) private geoCoder: GeocoderService,
    @service(ProvSuggestionsCommonService)
    private provSuggestionsCommonService: ProvSuggestionsCommonService,
    @service(DashboardTableCommonService)
    private dashboardTableCommonService: DashboardTableCommonService,
    @service(MonarchaClient)
    private monarchaClient: MonarchaClient,
    @inject(CommonBindings.IP) private reqIP: string,
    @inject(CommonBindings.REQUEST, {optional: true}) private req: Request,
    @inject('ORG_ID') private orgId: string,
  ) {
    super(ctx);
  }

  async getFullProvenanceV2(input: any) {
    // add service object
    const inst = new GetFullProvByTokenIdHelperV2(
      this.geoCoder,
      {...input, userAgent: this?.req?.headers?.['user-agent']},
      this.reqIP,
      this.provSuggestionsCommonService,
      this.dashboardTableCommonService,
      this.monarchaClient,
      this.orgId,
      this.env,
      this.credentialConfig,
    );
    const ret = await inst.get();
    return ret;
  }

  async getProvStepCreds(reqData: any) {
    log.info(`get Prov step cred for provenance ==> ${reqData?.provId}`);
    // get the global info
    const provCredGlobalRes = await new GetProvCredGlobalHelper({
      gtin: reqData.gtin,
      credTxIds: reqData.credTxIds,
      userProfile: reqData?.userProfile,
    }).get();
    // get the main provenance credential info
    const provStepCredsRes: any = [];
    let provCredMainRes: any = {};
    for (let i = 0; i < provCredGlobalRes?.credTxs.length; i++) {
      provCredMainRes = await new GetProvCredMainHelper(
        {userProfile: reqData?.userProfile},
        provCredGlobalRes?.credTxs[i],
        provCredGlobalRes?.sdrPersonaTx,
        provCredGlobalRes?.persona,
        provCredGlobalRes?.personaFieldMapping,
        provCredGlobalRes?.item,
        provCredGlobalRes?.variant,
        provCredGlobalRes?.credTemplates,
        provCredGlobalRes?.defaultCredTemplate,
        provCredGlobalRes?.org,
        this.env,
        this.monarchaClient,
        this.credentialConfig,
      ).get();
      provStepCredsRes.push(provCredMainRes);
    }
    return provStepCredsRes;
  }
}
