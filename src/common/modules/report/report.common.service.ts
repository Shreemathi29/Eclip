/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {AWSService} from '@/common/services/aws-s3.service';
import {log} from '@/utils/logging';
import {inject, service} from '@loopback/core';
import mongoose from 'mongoose';
import {Context} from 'vm';
import {Report, Status} from './report.model';

export class ReportCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @service(AWSService) private awsService: AWSService,
  ) {
    super(ctx);
  }

  // Prepare data for CSV using rows and columns
  async prepareDataForCSV(rowData: any, columnDefs: any) {
    let rowJson: any = {};
    const csvArr = rowData.map(function (row: any) {
      rowJson = {};
      columnDefs.map(function (column: any) {
        if (column.accessor == 'date') {
          rowJson[column.header] = row[column.accessor].toString();
        } else {
          rowJson[column.header] = row[column.accessor];
        }
      });
      return rowJson;
    });
    return csvArr;
  }

  async createReport(reportData: {
    filters: any;
    tableName: string;
    totalEntries: number;
    status?: string;
  }) {
    reportData.status = Status.requested;
    const reportCreationRes = await Report.create(reportData);
    return reportCreationRes;
  }

  async updateReport(reportId: mongoose.Types.ObjectId, downloadLink: string) {
    const updateReportRes = await Report.updateOne(
      {
        _id: reportId,
      },
      {
        reportLink: downloadLink,
        status: Status.available,
      },
    );
    return updateReportRes;
  }

  async initiateReportDownload(reportData: any) {
    const csvData = await this.prepareDataForCSV(
      reportData.rowData,
      reportData.columnDefs,
    );
    // create Report
    const createReport = await this.createReport({
      filters: reportData.filters,
      tableName: reportData.tableName,
      totalEntries: reportData.totalEntries,
    });
    // create csv file in memory and upload to aws
    const uplodCSVResponse = await this.awsService.createCSVandUploadtoAws(
      csvData,
      reportData?.tableName,
      false,
    );
    // update report
    const updateReport = await this.updateReport(
      createReport._id,
      uplodCSVResponse.url,
    );
    log.info('Report generated successfully');
    return true;
  }
}
