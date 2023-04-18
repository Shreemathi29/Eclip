/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {AnalyticsJobHandlerService} from '@/components/scheduler/analytics.jobHandler.service';
import {bind, BindingScope, inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import _, {capitalize} from 'lodash';
import {humanize} from 'uno-js';
import {Context} from 'vm';
import {Analytics, IAnalytics} from './analytics.model';

@bind({scope: BindingScope.SINGLETON})
export class AnalyticsCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @service(AnalyticsJobHandlerService)
    private analyticsJobHandlerService: AnalyticsJobHandlerService,
  ) {
    super(ctx);
  }

  @authAndAuthZ('read', 'Analytics')
  public refresh() {
    // return this.analyticsJobHandlerService.refreshInternal();
    return 'refresh initiated';
  }

  @authAndAuthZ('read', 'Analytics')
  public async getAnalytics() {
    const analytics = await Analytics.findOne();

    if (!analytics) {
      throw new HttpErrors.NotFound(`analytics not found`);
    }

    return {
      name: analytics.name,
      counts: analytics.counts,
      choropleth: analytics.scanLogChoropleth,
      scansGraph: analytics.scansGraph,
      scansGraphWithBrandProtection: analytics.scansGraphWithBrandProtection,
      sapCallsPerDay: analytics.sapCallsPerDay,
      provPerProductPerFactory: analytics.provPerProductPerFactory,
      ratingsGraph: analytics.ratingsGraph,
      // feedbacksGraph: analytics.feedbacksGraph,
      // productsGraph: analytics.productsGraph,
      // scanTrends: analytics.scanTrends,
      // scansPercentage: analytics.scansPercentage,
      // productsPercentage: analytics.productsPercentage,
      // scansPerState: analytics.scansPerState,
      updatedAt: analytics.updatedAt,
    };
  }
  //  --------------------------private methods ---------------------------------
  private getStats(analytics: IAnalytics) {
    const stats: {title: string; count: number}[] = [];
    const counts: {[k: string]: number} = analytics.counts;
    for (const prop in counts) {
      stats.push({
        title: `Total ${capitalize(prop)}`,
        count: counts[prop],
      });
    }
    return stats;
  }
  private getCredentialBarGraph(analytics: IAnalytics) {
    const graphs: {[k: string]: any} = _.pick(analytics, [
      'credentialIssued',
      'credetialRevoked',
      'credentialDisputed',
    ]);
    const barGraphs: {
      name: string;
      series: {name: string; data: {x: string; y: number}[]};
    }[] = [];

    for (const prop in graphs) {
      barGraphs.push({
        name: humanize(prop),
        series: graphs[prop],
      });
    }

    return barGraphs;
  }

  private getVPRBarGraph(analytics: IAnalytics) {
    const graphs: {[k: string]: any} = _.pick(analytics, ['vpr']);
    const barGraphs: {
      name: string;
      series: {name: string; data: {x: string; y: number}[]};
    }[] = [];
    for (const prop in graphs) {
      barGraphs.push({
        name: humanize(prop),
        series: graphs[prop],
      });
    }
    return barGraphs;
  }
}
