import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IAnalytics extends Document {
  name: string;
  counts: any;
  scanLogChoropleth: {data: {_id: string; count: number}[]};
  scanTrends: {
    daily: AnalyticsTrendsData;

    weekly: AnalyticsTrendsData;
    monthly: AnalyticsTrendsData;
    yearly: AnalyticsTrendsData;
  };
  sapCallsPerDay: {data: sapCallsPerDayInfo[]};
  dispatchCallsPerDay: {data: dispatchCallsPerDayInfo[]};
  dispatchObjPerDay: {data: dispatchObjPerDayInfo[]};
  provPerProductPerFactory: {data: provPerProductPerFactoryInfo[]};
  scansPerState: {data: {name: string; data: AnalyticsGraphPoint[]}[]};
  scansGraph: {data: AnalyticsGraphPoint[]};
  scansGraphWithBrandProtection: {data: AnalyticsGraphPoint[]};
  feedbacksGraph: {data: AnalyticsGraphPoint[]};
  productsGraph: {data: AnalyticsGraphPoint[]};
  ratingsGraph: {data: AnalyticsGraphPoint[]};
  scansPercentage: {data: AnalyticsGraphPoint[]};
  productsPercentage: {data: AnalyticsGraphPoint[]};
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AnalyticsTrendsData {
  count: number;
  trend: string;
}

export interface sapCallsPerDayInfo {
  status: string;
  data: {date: Date; count: number}[];
}

export interface dispatchCallsPerDayInfo {
  status: string;
  data: {date: Date; count: number}[];
}

export interface dispatchObjPerDayInfo {
  date: Date;
  count: number;
}

export interface provPerProductPerFactoryInfo {
  name: string;
  data: {count: number; plantCode: string; plantName: string}[];
}

export interface AnalyticsGraphPoint {
  x: string;
  y: number;
}
/**
 * Schema
 */
const analyticsTrendDataSchema = new Schema({
  count: {type: Number},
  trend: {type: String},
});

const sapApiAnalyticsTrendDataSchema = new Schema({
  data: [
    {
      status: String,
      data: [{date: Date, count: Number}],
    },
  ],
});

const dispatchApiAnalyticsTrendDataSchema = new Schema({
  data: [
    {
      status: String,
      data: [{date: Date, count: Number}],
    },
  ],
});

const dispatchObjAnalyticsTrendDataSchema = new Schema({
  data: [
    {
      date: Date,
      count: Number,
    },
  ],
});

const provPerproductPerFactorySchema = new Schema({
  data: [
    {
      name: String,
      data: [{count: Number, plantCode: String, plantName: String}],
    },
  ],
});

const analyticsPointSchema = new Schema({
  data: [{x: String, y: Number}],
});

export const analyticsSchema = new Schema(
  {
    name: {type: String, required: true, trim: true, unique: true},
    counts: {type: mongoose.Schema.Types.Mixed},
    scanLogChoropleth: {data: [{_id: {type: String}, count: {type: Number}}]},
    scanTrends: {
      daily: {
        type: analyticsTrendDataSchema,
      },
      weekly: {
        type: analyticsTrendDataSchema,
      },
      monthly: {
        type: analyticsTrendDataSchema,
      },
      yearly: {
        type: analyticsTrendDataSchema,
      },
    },
    sapCallsPerDay: {
      type: sapApiAnalyticsTrendDataSchema,
    },
    dispatchCallsPerDay: {
      type: dispatchApiAnalyticsTrendDataSchema,
    },
    dispatchObjPerDay: {
      type: dispatchObjAnalyticsTrendDataSchema,
    },
    provPerProductPerFactory: {
      type: provPerproductPerFactorySchema,
    },
    scansGraph: {type: analyticsPointSchema},
    scansGraphWithBrandProtection: {type: analyticsPointSchema},
    feedbacksGraph: {type: analyticsPointSchema},
    productsGraph: {type: analyticsPointSchema},
    scansPerState: {
      data: [{name: {type: String}, data: {type: [{x: String, y: Number}]}}],
    },
    ratingsGraph: {type: analyticsPointSchema},
    scansPercentage: {type: analyticsPointSchema},
    productsPercentage: {type: analyticsPointSchema},
  },
  {timestamps: true},
);

export const Analytics = mongoose.model<IAnalytics>(
  'analytics',
  analyticsSchema,
);
