/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const Analytics = gql`
  extend type Query {
    getAnalytics: Analytics
    refreshAnalytics: String
  }

  type Analytics {
    name: String
    counts: JSON
    choropleth: choropleth
    scansGraph: scansGraph
    ratingsGraph: ratingsGraph
    scansGraphWithBrandProtection: scansGraph
    sapCallsPerDay: sapCallsPerDay
    provPerProductPerFactory: provPerProductPerFactory
    # feedbacksGraph: feedbacksGraph
    # productsGraph: productsGraph
    # scanTrends: scanTrends
    # scansPercentage: scansPercentage
    # productsPercentage: productsPercentage
    # scansPerState: scansPerState
    updatedAt: GDate
  }
  type feedbacksGraph {
    id: ID
    data: [GraphPoint]
  }
  type productsGraph {
    id: ID
    data: [GraphPoint]
  }
  type scanTrends {
    daily: trend
    weekly: trend
    monthly: trend
    yearly: trend
  }
  type trend {
    count: Int
    trend: String
  }
  type ratingsGraph {
    id: ID
    data: [GraphPoint]
  }
  type scansPercentage {
    id: ID
    data: [GraphPoint]
  }
  type productsPercentage {
    id: ID
    data: [GraphPoint]
  }
  type scansPerState {
    data: [scansPerStateData]
  }
  type scansPerStateData {
    name: String
    data: [GraphPoint]
  }
  type scansGraph {
    id: ID
    data: [GraphPoint]
  }
  type sapCallsPerDay {
    _id: ID
    data: [sapData]
  }
  type provPerProductPerFactory {
    _id: ID
    data: [provProdData]
  }
  type choropleth {
    data: [choroplethData]
  }
  type choroplethData {
    _id: String
    count: Int
  }
  type GraphPoint {
    x: String
    y: Int
  }
  type sapData {
    _id: ID
    data: [sapObjData]
    status: String
  }
  type sapObjData {
    _id: ID
    count: Int
    date: GDate
  }
  type provProdData {
    _id: ID
    data: [provPerFactory]
    name: String
  }
  type provPerFactory {
    _id: ID
    count: Int
    plantName: String
  }
`;
