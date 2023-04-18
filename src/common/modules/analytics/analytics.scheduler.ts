/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log} from '@/utils/logging';
import {bind, BindingScope, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {IOrgType} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {Entity} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/entity/entity.model';
import {AssetCatalogueModuleService} from '@vlinder-be/asset-catalogue-module/dist/module/services/module.service';
import moment from 'moment';
import {Application} from '../application/application.model';
import {Bundle} from '../bundle/bundle.model';
import {Holder} from '../holder/holder.model';
import {Role} from '../role/role.model';
import {Analytics} from './analytics.model';

@bind({scope: BindingScope.SINGLETON})
export class AnalyticsJobHandlerService {
  private lastRefresh: Date;
  constructor(
    @service(AssetCatalogueModuleService)
    private assetCatalogueModuleService: AssetCatalogueModuleService,
  ) {}

  job() {
    this.start()
      .then(x => {
        console.info(`analytics scheduler job handled ${Date().toString()}`);
      })
      .catch(err => {
        console.error(`error while schedule instance ${err.message}`);
      });
  }

  public refreshInternal() {
    const diffSeconds = Math.abs(
      moment(this.lastRefresh).diff(moment(), 'seconds'),
    );
    if (this.lastRefresh && diffSeconds < 5)
      return `A refresh was just initaiated ${diffSeconds} seconds ago`;

    this.start()
      .then(x => {
        console.info(`analytics data refreshed ${Date().toString()}`);
      })
      .catch(err => {
        console.error(`error while refreshing analytics data ${err.message}`);
      });
    return 'refresh initiated';
  }

  private async start() {
    const counts = await this.getCounts();
    const statGraphs = await this.getStatGraphs();

    const credentialIssued = await this.getTemplatewiseMonthlyTimelineData();
    // @ts-ignore
    // TODO: move this call to seprate dunction
    const newData = await Analytics.findOneAndUpdate(
      {},
      {
        counts,
        statGraphs,
        credentialIssued,
        // credetialRevoked,
        // credentialDisputed,
      },
      {new: true, upsert: true},
    );
    this.lastRefresh = new Date();
    log.info('Analytics are updated');
  }

  private async getCounts() {
    const issuerOrg = await this.getIssuerOrg();
    const roles = await Role.find().countDocuments();
    const applications = await Application.find().countDocuments();
    const holders = await Holder.find().count();
    const credentials = await Entity.find().count();
    const bundles = await Bundle.find().countDocuments();
    return {
      roles,
      applications,
      holders,
      credentials,
      bundles,
    };
  }
  //  -------------------------------------------------------------
  private async getStatGraphs() {
    const credentialIssued =
      await this.getCredentialIssuedMonthlyTimelineData();
    const holderMonthly = await this.getHolderMonthlyTimelineData();
    return [
      {
        name: 'Issued',
        data: credentialIssued.data,
      },
      {
        name: 'Holder',
        data: holderMonthly.data,
      },
    ];
  }

  async getIssuerOrg() {
    const org = await this.assetCatalogueModuleService.brand.findOne({
      orgType: IOrgType.NETWORK,
    });
    if (!org) {
      throw new HttpErrors.NotFound(`organization not found `);
    }
    return org;
  }
  //  --------------------------------------------------------------------
  private getMonthlyTimelineStages() {
    const dateFrom = moment().subtract(6, 'months').toISOString();
    // console.log(dateFrom);
    return [
      {
        $match: {
          createdAt: {$gte: new Date(dateFrom)},
        },
      },
      {
        $group: {
          _id: {
            month: {$month: '$createdAt'},
            year: {$year: '$createdAt'},
            // name: '$name',
          },
          count: {$sum: 1},
        },
      },
      {
        $sort: {
          '_id.month': 1,
          '_id.year': 1,
        },
      },
      // {
      //   $group: {
      //     _id: '$_id.name',
      //     data: {
      //       $push: {groupData: '$_id', count: '$count'},
      //     },
      //   },
      // },
    ];
  }

  private async getTemplatewiseMonthlyTimelineData() {
    const dateFrom = moment().subtract(6, 'months').toISOString();
    // console.log(dateFrom);
    const stages = [
      {
        $match: {
          createdAt: {$gte: new Date(dateFrom)},
        },
      },
      {
        $group: {
          _id: {
            month: {$month: '$createdAt'},
            year: {$year: '$createdAt'},
            name: '$name',
          },
          count: {$sum: 1},
        },
      },
      {
        $sort: {
          '_id.month': 1,
          '_id.year': 1,
        },
      },
      {
        $group: {
          _id: '$_id.name',
          data: {
            $push: {groupData: '$_id', count: '$count'},
          },
        },
      },
    ];
    const retData = await Entity.aggregate(stages);
    const data = retData.map((val: {_id: any; data: any[]}) => {
      return {
        name: val._id,
        data: val.data?.map((ele: any) => {
          return {
            x: this.getMonthLabel(ele?.groupData?.month),
            y: ele?.count,
          };
        }),
      };
    });
    return data;
  }

  private async getCredentialIssuedMonthlyTimelineData() {
    const stages = this.getMonthlyTimelineStages();
    const retData = await Entity.aggregate(stages);
    // console.log(retData);
    const data = retData.map((val: {_id: {month: number}; count: any}) => {
      return {
        x: this.getMonthLabel(val?._id?.month),
        y: val.count,
      };
    });

    return {data};
  }

  private async getHolderMonthlyTimelineData() {
    const stages = this.getMonthlyTimelineStages();
    const retData = await Holder.aggregate(stages);
    // console.log(retData);
    const data = retData.map(val => {
      return {
        x: this.getMonthLabel(val?._id?.month),
        y: val.count,
      };
    });

    return {data};
  }

  private getMonthLabel(month: number) {
    switch (month) {
      case 1:
        return 'Jan';
      case 2:
        return 'Feb';
      case 3:
        return 'Mar';
      case 4:
        return 'Apr';
      case 5:
        return 'May';
      case 6:
        return 'Jun';
      case 7:
        return 'Jul';
      case 8:
        return 'Aug';
      case 9:
        return 'Sep';
      case 10:
        return 'Oct';
      case 11:
        return 'Nov';
      case 12:
        return 'Dec';
      default:
        return '';
    }
  }
}
