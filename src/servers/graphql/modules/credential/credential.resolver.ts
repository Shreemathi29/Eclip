/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {CredTranCommonService} from '@/common/modules/credentialTransactions/credentialTransaction.common.service';
import {CredentialService, FlinstoneService} from '@/domain-services';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const CredentialResolver = {
  Query: {
    async getCredentialTemplates(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(FlinstoneService),
      ) as FlinstoneService;
      return serv.getCredentialTemplates(args.input);
    },
    async verifyCredential(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CredentialService),
      ) as CredentialService;
      return serv.verifyCredential(args);
    },

    async getCredentialStatus(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CredentialService),
      ) as CredentialService;
      return serv.getCredentialStatus(args);
    },
  },

  Mutation: {
    async issueCredential(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CredentialService),
      ) as CredentialService;
      return serv.issueCredential(args);
    },
    async sendEmailAndPN(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CredentialService),
      ) as CredentialService;
      return serv.sendEmailAndPN(args);
    },

    async updateCredentialStatus(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CredentialService),
      ) as CredentialService;
      return serv.updateCredentialStatus(args);
    },

    async updateCredentialAndIssue(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CredTranCommonService),
      ) as CredTranCommonService;
      return serv.updateStepCredential(args);
    },
  },
};
