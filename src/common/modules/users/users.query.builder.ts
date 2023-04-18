/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {ISearchUserInput} from './user.model';

export const buildQuery = (criteria: ISearchUserInput = {}) => {
  const query: any = {};

  if (criteria) {
    if (criteria.givenName) {
      query.givenName = {$regex: criteria.givenName, $options: 'i'};
    }

    if (criteria.familyName) {
      query.familyName = {$regex: criteria.familyName, $options: 'i'};
    }

    if (criteria.email) {
      query.email = {$regex: criteria.email, $options: 'i'};
    }

    if (criteria.emailVerified) {
      query.emailVerified = true;
    }

    if (criteria.accessForbidden) {
      query.accessForbidden = true;
    }
  }

  return query;
};
