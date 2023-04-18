/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {bind, BindingScope, inject} from '@loopback/context';
import {Context} from 'vm';
import {DashboardTableCommonService} from '../dashboardTable/dashboardTable.common.service';

@bind({scope: BindingScope.SINGLETON})
export class ScanLogTableCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.DashboardTableCommonService')
    private dbTableCommonServ: DashboardTableCommonService, // @inject('config.tragConfig') private tragConfig: any, //TODO: do we have this config ?
  ) {
    super(ctx);
  }
}
