/*

 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {getRequiredHeaders} from '@/utils/pickHeaders';
import {HttpErrors} from '@loopback/rest';
import {log} from '@utils/logging';
import {tracer} from '@utils/tracer';
import {errorHandler} from 'graphql-middleware-error-handler';
import _ from 'lodash';
import {Span, Tags} from 'opentracing';

export const TraceLogging = async (
  resolve: any,
  root: any,
  args: any,
  context: any,
  info: any,
) => {
  if (info?.path && info?.path?.key && !info.path.prev) {
    const span: Span = tracer.startSpan(info.path.key);
    try {
      span.setTag('args', removeSensitiveKeys(args));
      span.setTag('origin', context?.req?.headers?.origin);
      span.setTag('headers', _.omit(context?.req?.headers, ['authentication']));
      const result = await resolve(root, args, {...context, span}, info);
      if (result?.originalError) {
        span.setTag(Tags.ERROR, true);
        span.log({event: 'error', message: result?.originalError.message});
      }
      span.finish();
      return result;
    } catch (err) {
      span.setTag(Tags.ERROR, true);
      span.log({event: 'error', message: err.message});
      span.finish();
      throw err;
    }
  }
  const result = await resolve(root, args, context, info);
  return result;
};

export const GqlRequestLogging = async (
  resolve: any,
  root: any,
  args: any,
  context: any,
  info: any,
) => {
  if (info?.path && info?.path?.key && !info.path.prev) {
    const methodName = info?.path?.key;

    const startTime = new Date().getTime();
    const logValue = function (data?: any) {
      const error = data?.originalError;
      const endTime = new Date().getTime();
      const diffMs = endTime - startTime;
      const retStatus = error ? error?.statusCode || 500 : 200;
      log.info(`GQL=> ${diffMs} ms, ${methodName}, ${retStatus}`, {
        headers: getRequiredHeaders(context.req),
      });
    };
    try {
      const result = await resolve(root, args, context, info);
      logValue(result);
      return result;
      // eslint-disable-next-line no-useless-catch
    } catch (err) {
      logValue(err);
      throw err;
    }
  }
  const result = await resolve(root, args, context, info);
  return result;
};

export const errorHandlerMiddleware = errorHandler({
  onError: (error: any, context: any) => {
    log.error(`Error ==> ${error.message}`);
    console.log(`error`, error);
    if (
      HttpErrors.isHttpError(error?.originalError) &&
      (error?.originalError as HttpErrors.HttpError).statusCode < 500
    ) {
      throw error;
    } else {
      if (
        (error.message as string)
          ?.toLowerCase()
          .includes('e11000 duplicate key')
      )
        throw new HttpErrors.BadRequest(
          `some of the provided values are already present ${(
            error.message as string
          )
            ?.split('dup key')
            .pop()}`,
        );
      throw new Error('Internal Server Error');
    }
    // send error anywhere
  },
  captureReturnedErrors: true,
  forwardErrors: true,
});

function removeSensitiveKeys(args: any) {
  const newArgs = _.omit(args, [
    'password',
    'idToken',
    'credential.password',
    'accessToken',
    'access_token',
  ]);
  return newArgs;
}

// class myPlugin implements ApolloServerPlugin {

//   async requestDidStart(requestContext: any) {
//     return {

//       async parsingDidStart() {
//         return async (err?: any) => {};
//       },
//       // async validationDidStart() {
//       //   // This end hook is unique in that it can receive an array of errors,
//       //   // which will contain every validation error that occurred.
//       //   return async (errs: any) => {};
//       // },
//       async executionDidStart() {
//         return {
//           async executionDidEnd(err?: any) {},
//         };
//       },

//     };
//   }
// }
