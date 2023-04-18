/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {ManufacturerCommonService} from '@/common/modules/manufacturer/manufacturer.common.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const ManufacturerResolver = {
  Query: {
    async getNetworkOperatorOrganization(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ManufacturerCommonService),
      ) as ManufacturerCommonService;
      return serv.getManufacturer();
    },
  },
  Mutation: {},
};
