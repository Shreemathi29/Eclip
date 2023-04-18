import {SapClient} from '@/clients/rest/sap.client';
import {Analytics} from '@/common/modules/analytics/analytics.model';
import {Batch} from '@/common/modules/batch/batch.model';
import {Feedback} from '@/common/modules/feedback/feedback.model';
import {Provenance} from '@/common/modules/provenance/provenance.model';
import {ScanLog} from '@/common/modules/scanLog/scanLog.model';
import {User} from '@/common/modules/users/user.model';
import {bind, BindingScope, inject} from '@loopback/core';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import moment from 'moment';
import mongoose from 'mongoose';

@bind({scope: BindingScope.SINGLETON})
export class AnalyticsJobHandlerService {
  constructor(
    @inject('env') private env: any,
    @inject('services.SapClient')
    private sapClient?: SapClient,
  ) {}

  job() {
    this.start()
      .then(x => {
        console.info(`job handled ${Date().toString()}`);
      })
      .catch(err => {
        console.error(`error while schedule instance ${err.message}`);
      });
  }
  private async start() {
    const counts = await this.getCounts();
    const choroplethData = await this.getChoroplethData();
    const scanlogMonthTimeline = await this.getScanlogMonthlyTimelineData();
    const scanlogMonthTimelineWithBrandProtection =
      await this.getScanlogMonthlyTimelineData(true);
    const provPerProductPerFactory = await this.getProvPerProductPerFactory();
    const sapCallsPerDay = await this.getSapCallsPerDay();
    const dispatchCallsPerDay = await this.getDispatchCallsPerDay();
    const dispatchObjPerDay = await this.getDispatchObjPerDay();
    const feedbackMonthTimeline = await this.getFeedbackMonthlyTimelineData();
    const productMonthTimeline = await this.getProductMonthlyTimelineData();
    const ratingsData = await this.getFeedbacksRatingsData();
    const scansPerStateData =
      await this.getScanlogMonthlyTimelinePerStateData();
    const scansPercentageTotal = scanlogMonthTimeline.data?.reduce(
      (acc, curr) => acc + curr.y,
      0,
    );
    const productsPercentageTotal = productMonthTimeline.data?.reduce(
      (acc: any, curr: {y: any}) => acc + curr.y,
      0,
    );
    const scanTrends = await this.getScanlogTrendData();
    const newData = await Analytics.findOneAndUpdate(
      {},
      {
        counts,
        scanLogChoropleth: {data: choroplethData},
        scansGraph: {data: scanlogMonthTimeline.data},
        scansGraphWithBrandProtection: {
          data: scanlogMonthTimelineWithBrandProtection.data,
        },
        sapCallsPerDay: {data: sapCallsPerDay},
        dispatchCallsPerDay: {data: dispatchCallsPerDay},
        dispatchObjPerDay: {data: dispatchObjPerDay},
        provPerProductPerFactory: {data: provPerProductPerFactory},
        feedbacksGraph: {data: feedbackMonthTimeline.data},
        productsGraph: {data: productMonthTimeline.data},
        ratingsGraph: {data: ratingsData.data},
        scansPerState: {data: scansPerStateData.data},
        scanTrends,
        productsPercentage: {
          data: productMonthTimeline.data?.map((val: {x: any; y: number}) => {
            return {
              x: val.x,
              y: Math.round((100 * val.y) / productsPercentageTotal),
            };
          }),
        },
        scansPercentage: {
          data: scanlogMonthTimeline.data?.map(val => {
            return {
              x: val.x,
              y: Math.round((100 * val.y) / scansPercentageTotal),
            };
          }),
        },
      },
      {new: true, upsert: true},
    );
  }

  private async getCounts() {
    const feedbacks = await Feedback.find().countDocuments();
    const scanlogs = await ScanLog.find().countDocuments();
    const products = await Item.find().countDocuments();
    const gtins = await Variant.find().countDocuments();
    const batches = await Batch.find().countDocuments();
    const provenances = await Provenance.find().countDocuments();
    const users = await User.find().countDocuments();
    return {
      feedbacks,
      scanlogs,
      products,
      gtins,
      batches,
      provenances,
      users,
    };
  }
  //  -------------------------------------------------------------
  private async getChoroplethData() {
    const data = await ScanLog.aggregate(this.getScanlogStages());
    return data;
  }

  private async getProvPerProductPerFactory() {
    const allItems = await Item.find();
    // find provenance per item
    // Using forloop over map because map doesn't work with async await
    const allProvPerItemPerFactory = [];
    for (let i = 0; i < allItems.length; i++) {
      const allProvForItem: any = await Provenance.aggregate(
        this.getProvPerProductPerFactoryStages(allItems[i]._id),
      );
      allProvPerItemPerFactory.push({
        name: allItems[i]?.name,
        data: this.processItemProvs(allProvForItem) || [],
      });
    }
    return allProvPerItemPerFactory;
  }

  private processItemProvs(provArr: any) {
    const processProvArr = provArr?.map(
      (prov: {count: any; plantCode: any; Fssai: {plantDesc: any}}) => {
        return {
          count: prov?.count,
          platCode: prov?.plantCode,
          plantName: prov?.Fssai?.plantDesc || prov?.plantCode,
        };
      },
    );
    return processProvArr;
  }

  private async getSapCallsPerDay() {
    let ret = null;
    try {
      if (this.env?.GET_SAP_ANALYTICS) {
        ret = await this.sapClient?.getProvDumpCallsPerDay();
      } else {
        ret = [];
      }
    } catch (err) {
      ret = [];
    }
    return ret;
  }

  private async getDispatchCallsPerDay() {
    let ret = null;
    try {
      if (this.env?.GET_SAP_ANALYTICS) {
        ret = await this.sapClient?.getDispatchCallsPerDay();
      } else {
        ret = [];
      }
    } catch (err) {
      ret = [];
    }
    return ret;
  }

  private async getDispatchObjPerDay() {
    let ret = null;
    try {
      if (this.env?.GET_SAP_ANALYTICS) {
        ret = await this.sapClient?.getDispatchObjPerDay();
      } else {
        ret = [];
      }
    } catch (err) {
      ret = [];
    }
    return ret;
  }

  private getProvPerProductPerFactoryStages(itemId: mongoose.Types.ObjectId) {
    return [
      {
        $match: {
          item: itemId,
          plantCode: {$exists: true, $ne: null},
        },
      },
      {
        $group: {
          _id: '$plantCode',
          count: {$sum: 1},
          plantCode: {$last: '$plantCode'},
          item: {$last: '$item'},
        },
      },
      {
        $lookup: {
          from: 'fssais',
          localField: 'plantCode',
          foreignField: 'plantCode',
          as: 'Fssai',
        },
      },
      {
        $unwind: {
          path: '$Fssai',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'Product',
        },
      },
      {
        $unwind: {
          path: '$Product',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }

  private getScanlogStages() {
    return [
      {
        $match: {'location.country': 'IN'},
      },

      {
        $group: {
          _id: '$location.region',
          count: {$sum: 1},
        },
      },
    ];
  }
  //  --------------------------------------------------------------------
  private getMonthlyTimelineStages(isShelfLifeExceeded = false) {
    const dateFrom = moment().subtract(6, 'months').toISOString();
    return [
      {
        $match: {
          createdAt: {$gte: new Date(dateFrom)},
          isShelfLifeExceeded: isShelfLifeExceeded,
        },
      },
      {
        $group: {
          _id: {
            month: {$month: '$createdAt'},
            year: {$year: '$createdAt'},
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
    ];
  }

  private async getScanlogMonthlyTimelineData(isShelfLifeExceeded = false) {
    const stages = this.getMonthlyTimelineStages(isShelfLifeExceeded);
    const retData = await ScanLog.aggregate(stages);
    // console.log(retData);
    const data = retData.map(val => {
      return {
        x: this.getMonthLabel(val?._id?.month),
        y: val.count,
      };
    });
    return {data};
  }

  private async getFeedbackMonthlyTimelineData() {
    const stages = this.getMonthlyTimelineStages();
    const retData = await Feedback.aggregate(stages);
    // console.log(retData);
    const data = retData.map(val => {
      return {
        x: this.getMonthLabel(val?._id?.month),
        y: val.count,
      };
    });
    return {data};
  }
  private async getProductMonthlyTimelineData() {
    const stages = this.getMonthlyTimelineStages();
    const retData = await Item.aggregate(stages);

    const data = retData.map((val: {_id: {month: number}; count: any}) => {
      return {
        x: this.getMonthLabel(val?._id?.month),
        y: val.count,
      };
    });
    return {data};
  }
  //  ------------------------------------------------------------------------
  private getFeedbackTimelineStages() {
    // const dateFrom = moment().subtract(6, 'months').toISOString();

    return [
      {
        $group: {
          _id: '$rating',
          count: {$sum: 1},
        },
      },
    ];
  }

  private async getFeedbacksRatingsData() {
    const stages = this.getFeedbackTimelineStages();
    const retData = await Feedback.aggregate(stages);

    const data = [
      {x: 'Excellent', y: retData.find(val => val._id === 5)?.count || 0},
      {x: 'Very Good', y: retData.find(val => val._id === 4)?.count || 0},
      {x: 'Good', y: retData.find(val => val._id === 3)?.count || 0},
      {x: 'Fair', y: retData.find(val => val._id === 2)?.count || 0},
      {x: 'Poor', y: retData.find(val => val._id === 1)?.count || 0},
    ];
    return {data};
  }
  // ------------------------------------------------------------------------
  private getScanlogMonthlyTimelinePerStateStages() {
    const dateFrom = moment().subtract(6, 'months').toISOString();

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
            region: '$location.region',
          },
          count: {$sum: 1},
        },
      },

      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $group: {
          _id: '$_id.region',
          data: {
            $push: {groupData: '$_id', count: '$count'},
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];
  }

  private async getScanlogMonthlyTimelinePerStateData() {
    const stages = this.getScanlogMonthlyTimelinePerStateStages();
    const retData = await ScanLog.aggregate(stages);

    const data = retData
      .map(reg => {
        return {
          name: this.getStateLabel(reg._id),
          data: reg.data?.map((monthData: any) => {
            return {
              x: this.getMonthLabel(monthData?.groupData?.month),
              y: monthData?.count,
            };
          }),
        };
      })
      .filter(val => val.name !== 'unknown') as any[];
    // console.log(`data`, data);
    return {data};
  }
  // --------------------------------------------------------------------------
  async getScanlogTrendData() {
    const startOfday = moment().startOf('day');
    const startOfPrevday = moment().startOf('day').subtract(1, 'day');
    const startOfweek = moment().startOf('week');
    const startOfPrevweek = moment().startOf('week').subtract(1, 'week');
    const startOfmonth = moment().startOf('month');
    const startOfPrevmonth = moment().startOf('month').subtract(1, 'month');
    const startOfyear = moment().startOf('year');
    const startOfPrevyear = moment().startOf('year').subtract(1, 'year');

    const prevDayCount = await ScanLog.find({
      createdAt: {
        $gte: startOfPrevday.toISOString() as unknown as Date,
        $lt: startOfday.toISOString() as unknown as Date,
      },
    }).countDocuments();
    const currentDayCount = await ScanLog.find({
      createdAt: {
        $gte: startOfday.toISOString() as unknown as Date,
      },
    }).countDocuments();

    const prevweekCount = await ScanLog.find({
      createdAt: {
        $gte: startOfPrevweek.toISOString() as unknown as Date,
        $lt: startOfweek.toISOString() as unknown as Date,
      },
    }).countDocuments();
    const currentweekCount = await ScanLog.find({
      createdAt: {
        $gte: startOfweek.toISOString() as unknown as Date,
      },
    }).countDocuments();
    const prevmonthCount = await ScanLog.find({
      createdAt: {
        $gte: startOfPrevmonth.toISOString() as unknown as Date,
        $lt: startOfmonth.toISOString() as unknown as Date,
      },
    }).countDocuments();
    const currentmonthCount = await ScanLog.find({
      createdAt: {
        $gte: startOfmonth.toISOString() as unknown as Date,
      },
    }).countDocuments();
    const prevyearCount = await ScanLog.find({
      createdAt: {
        $gte: startOfPrevyear.toISOString() as unknown as Date,
        $lt: startOfyear.toISOString() as unknown as Date,
      },
    }).countDocuments();
    const currentyearCount = await ScanLog.find({
      createdAt: {
        $gte: startOfyear.toISOString() as unknown as Date,
      },
    }).countDocuments();
    return {
      daily: {
        count: Math.abs(currentDayCount - prevDayCount),
        trend: currentDayCount - prevDayCount >= 0 ? 'up' : 'down',
      },
      weekly: {
        count: Math.abs(currentweekCount - prevweekCount),
        trend: currentweekCount - prevweekCount >= 0 ? 'up' : 'down',
      },
      monthly: {
        count: Math.abs(currentmonthCount - prevmonthCount),
        trend: currentmonthCount - prevmonthCount >= 0 ? 'up' : 'down',
      },
      yearly: {
        count: Math.abs(currentyearCount - prevyearCount),
        trend: currentyearCount - prevyearCount >= 0 ? 'up' : 'down',
      },
    };
  }
  //
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

  private getStateLabel(key?: string) {
    switch (key) {
      case 'AP':
        return 'Andhra Pradesh';
      case 'AR':
        return 'Arunachal Pradesh';
      case 'AS':
        return 'Assam';
      case 'BR':
        return 'Bihar';
      case 'CT':
        return 'Chhattisgarh';
      case 'GA':
        return 'Goa';
      case 'GJ':
        return 'Gujarat';
      case 'HR':
        return 'Haryana';
      case 'HP':
        return 'Himachal Pradesh';
      case 'JH':
        return 'Jharkhand';
      case 'KA':
        return 'Karnataka';
      case 'KL':
        return 'Kerala';
      case 'MP':
        return 'Madhya Pradesh';
      case 'MH':
        return 'Maharashtra';
      case 'MN':
        return 'Manipur';
      case 'ML':
        return 'Meghalaya';
      case 'MZ':
        return 'Mizoram';
      case 'NL':
        return 'Nagaland';
      case 'OR':
        return 'Odisha';
      case 'PB':
        return 'Punjab';
      case 'RJ':
        return 'Rajasthan';
      case 'SK':
        return 'Sikkim';
      case 'TN':
        return 'Tamil Nadu';
      case 'TG':
        return 'Telangana';
      case 'TR':
        return 'Tripura';
      case 'UT':
        return 'Uttarakhand';
      case 'UP':
        return 'Uttar Pradesh';
      case 'WB':
        return 'West Bengal';
      case 'AN':
        return 'Andaman and Nicobar Islands';
      case 'CH':
        return 'Chandigarh';
      case 'DN':
        return 'Dadra and Nagar Haveli';
      case 'DD':
        return 'Daman and Diu';
      case 'DL':
        return 'Delhi';
      case 'JK':
        return 'Jammu and Kashmir';
      case 'LA':
        return 'Ladakh';
      case 'LD':
        return 'Lakshadweep';
      case 'PY':
        return 'Puducherry';
      default:
        return 'unknown';
    }
  }
}
