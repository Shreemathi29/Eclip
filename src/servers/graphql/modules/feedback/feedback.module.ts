/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {ScanLogTypeDefs} from '../scanLog/scanLog.type';
import {FeedbackResolver} from './feedback.resolver';
import {FeedbackTypedefs} from './feedback.type';

export const FeedbackModule = createModule({
  id: 'feedback-module',
  dirname: __dirname,
  typeDefs: [FeedbackTypedefs, ScanLogTypeDefs],
  resolvers: [FeedbackResolver],
});
