/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {
  CredentialService,
  FlinstoneService,
  OrganizationService,
} from '@/domain-services';
import { ClientService } from '@/domain-services/client.service';
import { VPRService } from '@/domain-services/vpr/vpr.service';
import { CredentialExternalViewController } from '@/servers/rest/controllers/credential/credential.openapi';
import { BindingScope, Context, ServiceOrProviderClass } from '@loopback/core';
import { v4 } from 'uuid';
import { AnalyticsCommonService } from '../modules/analytics/analytics.service';
import { ApplicationService } from '../modules/application/application.service';
import { BatchCommonService } from '../modules/batch/batch.common.service';
import { BatchLazyBindingParentCommonService } from '../modules/batchLazyBindingParent/batchLazyBindingParent.common.service';
import { BundleCommonService } from '../modules/bundle/bundle.common.service';
import { CampaignCommonService } from '../modules/campaign/campaign.common.service';
import { CampaignTemplateCommonService } from '../modules/campaignTemplate/campaignTemplate.common.service';
import {
  CredentialCommonService,
  CredentialViewService,
} from '../modules/credential';
import { CredTranCommonService } from '../modules/credentialTransactions/credentialTransaction.common.service';
import { CredHashCommonService } from '../modules/credHash/credHash.common.service';
import { DashboardTableCommonService } from '../modules/dashboardTable/dashboardTable.common.service';
import { EncodeCommonService } from '../modules/encode/encode.common.service';
import { EntityRangeCommonService } from '../modules/entityRange/entityRange.common.service';
import { FeedbackCommonService } from '../modules/feedback/feedback.common.service';
import { FullProvenanceCommonService } from '../modules/fullProvenance/fullProvenance.common.service';
import { FullProvenanceCommonServiceV2 } from '../modules/fullProvenanceV2/fullProvenanceV2.common.service';
import { HolderCommonService } from '../modules/holder/holder.common.service';
import { LateBindingCounterCommonService } from '../modules/lateBindingCounters/lateBindingCounter.common.service';
import { ManufacturerCommonService } from '../modules/manufacturer/manufacturer.common.service';
import { MasterDispatchCommonService } from '../modules/masterDispatch/masterDispatch.common.service';
import { NetworkGraphCommonService } from '../modules/networkGraph/network-graph.service';
import { PersonaCommonService } from '../modules/persona/persona.common.service';
import { ProductCommonService } from '../modules/products/products.common.service';
import { ProvenanceCommonService } from '../modules/provenance/provenance.common.service';
import { ProvTemplateCommonService } from '../modules/provenanceTemplate/provenanceTemplate.common.service';
import { ReportCommonService } from '../modules/report/report.common.service';
import { RoleCommonService } from '../modules/role/role.common.service';
import { ScanLogTableCommonService } from '../modules/scanLog/scanLog.common.service';
import { SDRPersonaTxCommonService } from '../modules/sdrPersonaTx/sdrPersonaTx.service';
import { SerializationGroupCommonService } from '../modules/serializationGroup/serializationGroup.common.service';
import { ThirdEyeCommonService } from '../modules/thirdEye/thirdEye.common.service';
import { TOSLogCommonService } from '../modules/tos-log/tos.common.service';
import { UserCommonService } from '../modules/users/user.common.service';
import { VariantCommonService } from '../modules/variants/variants.common.service';
import { CommonBindings, DECODED_JWT_AND_USER } from './common-bindings';
import { DecodedJWTProvider } from './decode-jwt.provider';

const requestIp = require('request-ip');
export class CommonRequestContext extends Context {
  // public ctx: Context;
  constructor(
    private parentCtx: Context,
    private bindings: {
      requestId?: string;
      request?: any;
      response?: any;
      jwt?: string;
    },
  ) {
    super(parentCtx);
    // const requestCtx = new RequestContext()
    this.scope = BindingScope.REQUEST;
    this.bindServices();
    this.bindOthers();
  }

  public async getCtx() {
    return this;
  }

  private bindServices() {
    this.bindService(UserCommonService);
    this.bindService(OrganizationService);
    this.bindService(DashboardTableCommonService);
    this.bindService(ApplicationService);
    this.bindService(BundleCommonService);
    this.bindService(CredentialCommonService);
    this.bindService(FlinstoneService);
    this.bindService(RoleCommonService);
    this.bindService(NetworkGraphCommonService);
    this.bindService(VPRService);
    this.bindService(CredentialViewService);
    this.bindService(AnalyticsCommonService);
    this.bindService(CredentialExternalViewController);
    this.bindService(CredentialService);
    this.bindService(ClientService);
    this.bindService(HolderCommonService);
    this.bindService(FullProvenanceCommonService);
    this.bindService(FullProvenanceCommonServiceV2);
    this.bindService(ProductCommonService);
    this.bindService(ManufacturerCommonService);
    this.bindService(MasterDispatchCommonService);
    this.bindService(VariantCommonService);
    this.bindService(BatchCommonService);
    this.bindService(EncodeCommonService);
    this.bindService(ProvenanceCommonService);
    this.bindService(ProvTemplateCommonService);
    this.bindService(CampaignTemplateCommonService);
    this.bindService(ReportCommonService);
    this.bindService(ScanLogTableCommonService);
    this.bindService(CampaignCommonService);
    this.bindService(FeedbackCommonService);
    this.bindService(SerializationGroupCommonService);
    this.bindService(EntityRangeCommonService);
    this.bindService(LateBindingCounterCommonService);
    this.bindService(SDRPersonaTxCommonService);
    this.bindService(PersonaCommonService);
    this.bindService(TOSLogCommonService);
    this.bindService(BatchLazyBindingParentCommonService);
    this.bindService(ThirdEyeCommonService);
    this.bindService(CredTranCommonService);
    this.bindService(CredHashCommonService);
    // this.bindService(CredentialViewService);
    //
    this.bind(DECODED_JWT_AND_USER)
      .toProvider(DecodedJWTProvider)
      .inScope(BindingScope.REQUEST);
    // ----------------------------------------------
  }

  private bindOthers() {
    this.bind(CommonBindings.REQUEST)
      .to(this.bindings.request)
      .inScope(BindingScope.REQUEST);
    this.bind(CommonBindings.RESPONSE)
      .to(this.bindings.response)
      .inScope(BindingScope.REQUEST);
    this.bind(CommonBindings.JWT)
      .to(this.bindings.jwt)
      .inScope(BindingScope.REQUEST);

    const requetsId = this.bindings.requestId ?? v4();
    this.bind(CommonBindings.REQUEST_ID)
      .to(requetsId)
      .inScope(BindingScope.REQUEST);
    const ip =
      this.bindings?.request && requestIp.getClientIp(this.bindings?.request);
    this.bind(CommonBindings.IP).to(ip).inScope(BindingScope.REQUEST);
    // this.bind(CommonBindings.REQUEST).to(this.bindings.request);
  }

  public bindService(serv: ServiceOrProviderClass<any>) {
    this.bind(`services.${serv.name}`)
      .toClass(serv)
      .tag('service')
      .inScope(BindingScope.REQUEST);
    // .inScope(BindingScope.REQUEST);
  }

  private getUser() { }

  // private async getDecoded() {
  //   const serv = this.ctx.getSync(
  //     'serices.VlinderLoginCommonService',
  //   ) as VlinderLoginCommonService;
  //   serv.verifyToken(this.bindings.jwt);
  // }
}
