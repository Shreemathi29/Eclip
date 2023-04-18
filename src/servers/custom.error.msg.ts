/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {HttpErrors} from '@loopback/rest';
import {GraphQLError, GraphQLFormattedError} from 'graphql';

enum ErrorMessage {
  SESSION_EXPIRED = 'session expired, please login.',
  INVALID_ACCESS_TOKEN = 'invalid access token.',
  EMPTY_PRIMARY_ASSET = 'please provide primary asset.',
  ASSET_NOT_FOUND = "asset you are looking for doesn't seem to exist.",
  MS_NOT_CONNECTED = 'opps, we are having truble in reaching out to one of our server, please try after sometime.',
  CATEGORY_NOT_FOUND = "category you are looking for doesn't seem to exist.",
  STORE_NOT_FOUND = "store you are looking for doesn't seem to exist.",
  TXN_NOT_FOUND = 'opps, we are having truble in fetching transaction details.',
  ORGANIZATION_NOT_FOUND = 'Opps, we are having truble in fetching your profile.',
  NOT_OWNED_BY_YOU = "asset you are looking for doesn't seem to be owned by you",
}

export const formatError = (
  error: GraphQLError,
): GraphQLFormattedError<Record<string, any>> => {
  const display_msg = getDisplayMsg(error?.message);
  return {
    message: display_msg,
    extensions: {
      name: error?.name,
      error_message: error?.message,
      error_type: getStatusType(
        (error?.originalError as HttpErrors.HttpError)?.status,
      ),
      error_code: (error?.originalError as HttpErrors.HttpError).statusCode,
      display_message: display_msg,
    },
    path: error?.path,
  };
};

const getDisplayMsg = (originalMsg: string) => {
  if (originalMsg?.includes('jwt expired')) return ErrorMessage.SESSION_EXPIRED;
  else if (
    originalMsg?.includes('primary asset can not be empty') ||
    originalMsg?.includes('asset does not have primary asset')
  )
    return ErrorMessage.EMPTY_PRIMARY_ASSET;
  else if (originalMsg?.includes("'token' is null"))
    return ErrorMessage.INVALID_ACCESS_TOKEN;
  else if (originalMsg?.includes('category not found'))
    return ErrorMessage.CATEGORY_NOT_FOUND;
  else if (originalMsg?.includes('store not found'))
    return ErrorMessage.STORE_NOT_FOUND;
  else if (originalMsg?.includes('txn not found'))
    return ErrorMessage.TXN_NOT_FOUND;
  else if (originalMsg?.includes('brand not found'))
    return ErrorMessage.ORGANIZATION_NOT_FOUND;
  else if (originalMsg?.includes('ECONNREFUSED'))
    return ErrorMessage.MS_NOT_CONNECTED;
  else if (originalMsg?.includes('not owned by you'))
    return ErrorMessage.NOT_OWNED_BY_YOU;
  else return originalMsg;
};
const getStatusType = (statusCode: number) => {
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
};
