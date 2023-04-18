/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';

export enum TablePropType {
  'default' = 'default',
  'avatar' = 'avatar',
  'country' = 'country',
  'currency' = 'currency',
  'phone' = 'phone',
  'email' = 'email',
  'icon' = 'icon',
  'rating' = 'rating',
  'progressBar' = 'progressBar',
  'sparkline' = 'sparkline',
  'button' = 'button',
  'anchor' = 'anchor',
  'pie' = 'pie',
}
const TablePropTypeArray = Object.values(TablePropType);
//--------------------------------------------------

/**
 * Schema
 */
export interface IDashboardTable extends Document {
  key: string;
  columnDefs: {
    type: TablePropType;
    isDetails: boolean;
    accessor: string;
    compProps: {
      headerName: string;
      field: string;
      sortable: boolean;
      filter: boolean;
      minWidth: number;
      [key: string]: any;
    };
    typeProps: any;
    valueStyle: {color: string; [key: string]: any};
  }[];
}

const DashboardTableSchema = new Schema(
  {
    key: {type: String, unique: true, trim: true},
    columnDefs: [
      {
        type: {type: String, enum: TablePropTypeArray},
        isDetails: {type: Boolean},
        accessor: {type: String},
        compProps: {
          headerName: {type: String},
          field: {type: String},
          sortable: {type: Boolean},
          filter: {type: Boolean},
          minWidth: {type: Number},
        },
        typeProps: {type: mongoose.Schema.Types.Mixed},
        valueStyle: {
          color: {type: String},
        },
      },
    ],
  },
  {timestamps: true, strict: false},
);

export const DashboardTable = mongoose.model<IDashboardTable>(
  'dashboardtable',
  DashboardTableSchema,
);
