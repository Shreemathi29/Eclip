/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {VlinderLoginCommonService} from '@/common/modules/users/vlinder-login.service';
import {Next} from 'graphql-modules/shared/middleware';

export const authorizeCustom =
  (features: any, action: any) => async (context: any, next: Next) => {
    const decodedFeatures = context.context?.currentUser?.features;
    if (Array.isArray(features) && Array.isArray(decodedFeatures)) {
      for (const feature of features) {
        if (decodedFeatures.includes(feature)) return next();
      }
    }
    throw new Error('You are not authorized');
  };
export const authenticate = () => async (context: any, next: Next) => {
  const loginService = context?.context.reqCtx?.getSync(
    'services.VlinderLoginCommonService',
  ) as VlinderLoginCommonService;
  const currentUser = await loginService.verifyToken(
    context.context?.authToken,
  );

  context.context['currentUser'] = currentUser;

  return next();
};
