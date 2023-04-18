/*


 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {CommonBindings} from '@/common/request-context/common-bindings';
import {CommonRequestContext} from '@/common/request-context/request-context';
import {log, pretty, tracingMiddleWare} from '@/utils';
import {
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import {config, inject} from '@loopback/context';
import {
  ExpressRequestHandler,
  FindRoute,
  HttpErrors,
  InvokeMethod,
  InvokeMiddleware,
  InvokeMiddlewareOptions,
  MiddlewareSequence,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import cors from 'cors';
import {randomBytes} from 'crypto';
// import {Metadata} from 'grpc';
import _ from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {reqLogMiddleware} from './middlewares/log.middleware';

const is = require('is_js');
const helmet = require('helmet');
const SequenceActions = RestBindings.SequenceActions;
const UNKNOWN_ERROR = {
  error_code: '500',
  error_type: 'UNKNOWN_ERROR',
  error_message: null,
  display_message: 'unknown error',
};

const middlewareList: ExpressRequestHandler[] = [
  //Add your express middleware here !!
  // helmet(),
  cors(),
];

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.INVOKE_MIDDLEWARE)
    readonly invokeMiddleware: InvokeMiddleware,

    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject('defaultConfig') private defaultConfig: any,
    @config()
    readonly options: InvokeMiddlewareOptions = MiddlewareSequence.defaultOptions,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      // --------------------------------------------------------------------------------
      reqLogMiddleware(context);
      tracingMiddleWare(request, response);
      this.bindCommonRequestCtx(context);
      this.setCSP(request, response);
      this.setRequestId(request, response);
      this.setVersion(request, response);

      // -------------------------Middleare Handling--------------------------------------------------------------------
      if (!_.isEmpty) {
        const exFinished = await this.invokeMiddleware(context, middlewareList);
        if (exFinished) return;
        // The response been produced by the middleware chain
      }

      // ------------------------------------Sequence Actions------------------------------------------------------------
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      // -------------------------------Error Handling-------------------------------------------
      // ------------------------------------------------------------------------------------------------

      if (result?.error) {
        log.warn(
          `error returned instead of thrown ==> ${result?.error?.message}`,
          result?.error,
        );
        context.response
          .status(this.getErrorCode(result?.error?.error_code))
          .send({
            request_id: context.request.headers['X-Request-Id'],
            error: result.error,
          });
        return;
      } else {
        if (_.isPlainObject(result))
          result.request_id = context.request.headers['X-Request-Id'];
        this.send(response, result);
      }
    } catch (err: any) {
      log.warn('error', err);
      log.error(
        `sequence.ts => ${err.message} details: ${pretty(err.details || [])} }`,
      );
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401 /* Unauthorized */});
      } else {
        const {errObj, statusCode} = this.getErrorObject(context, err);
        context.response.status(statusCode).send({
          error: errObj,
          request_id: context.request.headers['X-Request-Id'],
        });
        return;
      }
      // -------------------------------------------------------
      this.reject(context, err);
    }
  }

  //  -----------------------------private methods-----------------------------------------------------------------------------

  private setRequestId(request: any, response: any) {
    if (is.existy(request?.headers['X-Request-Id'])) {
      response.set({
        'X-Request-Id': request.headers['X-Request-Id'],
      });
      return;
    }
    const _reqId = uuidv4();
    request.headers['X-Request-Id'] = _reqId;
    response.set({
      'X-Request-Id': _reqId,
    });
  }
  private setCSP(request: any, response: any) {
    const nonce = randomBytes(16).toString('base64');
    response.set({
      'Content-Security-Policy': `script-src-elemc 'nonce-${nonce}' 'strict-dynamic';  object-src 'none'; base-uri 'none';`,
    });
  }

  private setVersion(request: any, response: any) {
    if (is.existy(request?.headers['app-Version'])) {
      return;
    }
    request.headers['app-Version'] = this.defaultConfig?.defaultVersion;
    response.set({
      'app-Version': this.defaultConfig?.defaultVersion,
    });
  }

  private bindCommonRequestCtx(context: RequestContext) {
    const {response, request} = context;
    const myRequestContext = new CommonRequestContext(context, {
      requestId: request?.headers['X-Request-Id'] as string,
      jwt: request?.headers?.authentication as string,
      request: request,
      response: response,
    });

    context.bind(CommonBindings.COMMON_REQ_CTX).to(myRequestContext);
  }
  // -----------------------------------------------------------
  private getErrorCode(code?: string) {
    try {
      if (_.isString(code)) {
        return parseInt(code);
      }
    } catch (err) {
      return 500;
    }
    return 500;
  }

  private getErrorObject(context: RequestContext, err: any) {
    const {status, message} = err.metadata?.getMap?.() || {};
    // console.log('status,message', status, message);
    const finalStatusCode = _.toSafeInteger(
      status || (err as HttpErrors.HttpError).statusCode || '500',
    );
    log.error(message || err.message, {status, finalStatusCode});

    if (!finalStatusCode || finalStatusCode >= 500)
      return {
        errObj: {
          error_code: _.toString(finalStatusCode),
          error_type: 'UNKNOWN_ERROR',
          error_message: 'unknown error',
          display_message: 'unknown error',
          // details: err.details,
        },
        statusCode: finalStatusCode,
      };
    return {
      errObj: {
        error_code: _.toString(finalStatusCode),
        error_type: this.getStatusType(finalStatusCode),
        error_message: message || err.message,
        display_message: message || err.message,
        details: (Array.isArray(err.details) && err.details) || undefined,
      },
      statusCode: finalStatusCode,
    };
  }

  private getStatusType(statusCode: number) {
    switch (statusCode) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 422:
        return 'UNPROCESSABLE_ENTITY';
      case 500:
        return 'INTERNAL_SERVER_ERROR';

      default:
        return 'UNKNOWN_ERROR';
    }
  }
}
