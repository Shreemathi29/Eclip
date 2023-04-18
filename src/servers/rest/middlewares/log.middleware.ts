/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {CommonBindings} from '@/common/request-context/common-bindings';
import {log} from '@/utils';
import {getRequiredHeaders} from '@/utils/pickHeaders';
import {RequestContext} from '@loopback/rest';
import {Context} from 'vm';

// export const restRequestloggerMiddleware: Middleware = async (
//   middlewareCtx,
//   next,
// ) => {
//   const {request, response} = middlewareCtx;
//   const startTime = new Date().getTime();

//   try {
//     const result = await next();
//     return result;
//     // eslint-disable-next-line no-useless-catch
//   } catch (err) {
//     throw err;
//   } finally {
//     response.on('finish', () => {
//       const endTime = new Date().getTime();
//       const diffMs = endTime - startTime;
//       log.info(
//         `${getServerName(middlewareCtx)}=> ${diffMs} ms ,${request.url}, ${
//           response.statusCode
//         }`,
//         {
//           headers: getRequiredHeaders(request),
//         },
//       );
//     });
//   }
// };

export const reqLogMiddleware = (middlewareCtx: RequestContext) => {
  const {request, response} = middlewareCtx;
  const startTime = new Date().getTime();
  if (
    request.url?.includes('swagger') ||
    request.url?.includes('explorer') ||
    request.url?.includes('favicon')
  )
    return;

  response.on('finish', () => {
    const endTime = new Date().getTime();
    const diffMs = endTime - startTime;
    log.info(
      `${getServerName(middlewareCtx)}=> ${diffMs} ms ,${request.url}, ${
        response.statusCode
      }`,
      {
        headers: getRequiredHeaders(request),
      },
    );
  });
};

function getServerName(ctx: Context) {
  try {
    return ctx.getSync(CommonBindings.SERVER_NAME);
  } catch (error) {
    return 'UNKNOWN-REST-SERVER';
  }
}
