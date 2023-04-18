/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {TOSLogCommonService} from '@/common/modules/tos-log/tos.common.service';
import {GqlCtx} from '../../graphql.component';
const useragent = require('useragent');
export const TOSResolver = {
  Query: {
    async isTAndCAccepted(root: any, args: any, ctx: GqlCtx) {
      const serv = getTOSService(ctx);
      return serv.isTAndCAccepted(args);
    },
  },
  Mutation: {
    async acceptTAndC(root: any, args: any, ctx: GqlCtx) {
      const serv = getTOSService(ctx);
      return serv.acceptTAndC({
        ip: ctx?.ip as string,
        action: args?.input?.type,
        service_agreement: args?.input?.agreementUrl,
        user_agent: useragent.lookup(ctx?.req.headers?.['user-agent']),
      });
    },
    async createTOS(root: any, args: any, ctx: GqlCtx) {
      const serv = getTOSService(ctx);
      args.input.user_agent = useragent.lookup(
        ctx?.req.headers?.['user-agent'],
      );
      const ret = serv.createTOSLogWithAuth(args.input);
      return ret;
    },
  },
};

const getTOSService = (ctx: GqlCtx) => {
  const serv = ctx.reqCtx.getSync(
    'services.TOSLogCommonService',
  ) as TOSLogCommonService;
  return serv;
};
