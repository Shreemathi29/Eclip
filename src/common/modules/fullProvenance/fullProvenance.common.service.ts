/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {
  KS1_DECODER_KEY,
  KS1_DECODER_SERVICE,
} from '@/clients/grpc/grpc-connect/grpc-connect.component';
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {CommonBindings} from '@/common/request-context/common-bindings';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {GeocoderService} from '@/common/services/geocoder.service';
import {bind, BindingScope, inject, service} from '@loopback/core';
import {Request} from 'express';
import {Context} from 'vm';
import {CredentialConfig} from '../credential';
import {LateBindingCounterCommonService} from '../lateBindingCounters/lateBindingCounter.common.service';
import {GetFullProvByTokenIdHelper} from './getFullProvByTokenId.helper';
import {GetProvCredHelper} from './getProvCred.helper';
import {ProvSuggestionsCommonService} from './provSuggestions.common.service';
import {VerifyItemCredHelper} from './verifyItemCred.helper';

@bind({scope: BindingScope.SINGLETON})
export class FullProvenanceCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('env') private env: any,
    @inject('services.LateBindingCounterCommonService')
    private lateBindingCounterCommonService: LateBindingCounterCommonService,
    @inject(KS1_DECODER_KEY)
    private ks1DecoderService: KS1_DECODER_SERVICE,
    @service(GeocoderService) private geoCoder: GeocoderService,
    @service(ProvSuggestionsCommonService)
    private provSuggestionsCommonService: ProvSuggestionsCommonService,
    @service(MonarchaClient)
    private monarchaClient: MonarchaClient,
    @inject('config.credential') private credentialConfig: CredentialConfig,
    @inject(CommonBindings.IP) private reqIP: string,
    @inject(CommonBindings.REQUEST, {optional: true}) private req: Request,
    @inject('ORG_ID') private orgId: string,
    @inject('config.ageVerificationConfig')
    private ageVerificationConfig?: any,
  ) {
    super(ctx);
  }

  // @authAndAuthZ('read', 'FullProvenance')
  async getFullProvenance(input: any) {
    // add service object
    const inst = new GetFullProvByTokenIdHelper(
      this.geoCoder,
      {...input, userAgent: this?.req?.headers?.['user-agent']},
      this.reqIP,
      this.provSuggestionsCommonService,
      this.monarchaClient,
      this.orgId,
      this.env,
      this.ageVerificationConfig,
    );
    const ret = await inst.get();
    return ret;
  }

  async getFullProvenanceNoAuth(input: any) {
    const inst = new GetFullProvByTokenIdHelper(
      this.geoCoder,
      {...input, userAgent: this?.req?.headers?.['user-agent']},
      this.reqIP,
      this.provSuggestionsCommonService,
      this.monarchaClient,
      this.orgId,
      this.env,
    );
    const ret = await inst.get();
    return ret;
  }

  // @authAndAuthZ('read', 'FullProvenance')
  async getProvenanceStepCred(args: any) {
    const ret = await new GetProvCredHelper(
      args,
      this.monarchaClient,
      this.credentialConfig,
    ).get();
    return ret;
  }

  async getProvenanceStepCredNoAuth(args: any) {
    const ret = await new GetProvCredHelper(
      args,
      this.monarchaClient,
      this.credentialConfig,
    ).get();
    return ret;
  }

  // @authAndAuthZ('read', 'FullProvenance')
  async verifyItemCred(args: any) {
    const ret = await new VerifyItemCredHelper(
      args,
      this.monarchaClient,
      this.credentialConfig,
    ).get();
    return ret;
  }
}
