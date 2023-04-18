/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {SapClient} from '@/clients/rest/sap.client';
import {WalletClient} from '@/clients/rest/wallet.client';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {log} from '@/utils';
import {bind, BindingScope, inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {
  Brand,
  IOrgType
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {capitalCase} from 'change-case';
import {Context} from 'vm';
import {batchLazyBindingParentAggregateBuilder} from '../batchLazyBindingParent/batchLazyBindingParent.aggregate.builder';
import {CampaignAggregateHelper} from '../campaign/campaign.aggregate.helper';
import {entityRangeAggregateBuilder} from '../entityRange/entityRange.aggregate.builder';
import {feedbackAggregateBuilder} from '../feedback/feedback.aggregate.builder';
import {Fssai} from '../fssai/fssai.model';
import {holderAggregateBuilder} from '../holder/holder.aggregate.builder';
import {Holder, HolderStatus, IHolder} from '../holder/holder.model';
import {VC} from '../networkGraph/graph-generator.helper';
import {PersonaAggregateHelper} from '../persona/persona.aggregate.helper';
import {Persona} from '../persona/persona.model';
import {ProvAggregateHelper} from '../provenance/provenance.aggregate.helper';
import {reportAggregator} from '../report/report.aggregate.builder';
import {ReportCommonService} from '../report/report.common.service';
import {ScanLogAggregateHelper} from '../scanLog/scanLog.aggregate.helper';
import {serializationGroupAggregateBuilder} from '../serializationGroup/serializationGroup.aggregate.builder';
import {UserCommonService} from '../users/user.common.service';
import {IUser} from '../users/user.model';
import {userAggregateBuilder} from '../users/users.aggregate.builder';
import {DashboardTable} from './dashboardTable.model';

export enum sortOrder {
  asc = 'asc',
  desc = 'desc',
}
export interface TableInput {
  criteria: any;
  skip: number;
  limit: number;
  sort: string;
  sortOrder: sortOrder;
}

@bind({scope: BindingScope.SINGLETON})
export class DashboardTableCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.UserCommonService')
    private userService: UserCommonService,
    @inject('services.ReportCommonService')
    private reportCommonServ: ReportCommonService,
    @inject('services.MonarchaClient')
    private monarcha: MonarchaClient,
    @inject('services.WalletClient')
    private walletClient: WalletClient, // @inject('config.generic') private coreConfig: CoreAndGatewayConfig,
    @inject('services.SapClient')
    private sapClient: SapClient,
  ) {
    super(ctx);
  }

  @authAndAuthZ('read', 'User')
  async getUserTable({criteria, limit, skip, sort, sortOrder}: TableInput) {
    // const key = this.coreConfig.dashboradTableNames.user;
    const key = 'User';
    const {tableMetadata} = await this.getTableMetadata(key);
    const ret: any = await userAggregateBuilder({
      criteria: {...(criteria || {})},
      skip,
      limit,
      sort,
      sortOrder,
    });
    const rowData = ret.data?.map((x: any, index: any) => {
      return {
        slNo: index + 1,
        name: this.userService.getFullName(x),
        email: x.email,
        role: x.Role?.name,
        status: this.getuserStatusAndAction(x).status,
        action: this.getuserStatusAndAction(x).action,
        edit: 'Edit',
        familyName: x.familyName,
        givenName: x.givenName,
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'User Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      ...ret,
      data: {
        columnDefs: tableMetadata.columnDefs,
        rowData,
      },
    };
  }

  @authAndAuthZ('read', 'Holder')
  async getHolderTable({criteria, limit, skip, sort, sortOrder}: TableInput) {
    // const key = this.coreConfig.dashboradTableNames.user;
    const key = 'Holder';
    const {tableMetadata} = await this.getTableMetadata(key);
    const ret: any = await holderAggregateBuilder({
      criteria: {...(criteria || {})},
      skip,
      limit,
      sort,
      sortOrder,
    });
    const rowData = ret.data?.map((x: any) => {
      return {
        name: this.userService.getFullName(x as any as IUser),
        email: x?.email,
        more: 'Invite',
        status: this.getHolderStatusLabel(x?.status),
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Holder Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      ...ret,
      data: {
        columnDefs: tableMetadata.columnDefs,
        rowData,
      },
    };
  }

  @authAndAuthZ('read', 'ScanLog')
  async getScanLogTable({criteria, limit, skip, sort, sortOrder}: TableInput) {
    //const key = this.tragConfig.dashboradTableNames.scanLog;
    const key = 'ScanLog';
    const {tableMetadata} = await this.getTableMetadata(key);
    const ret = await new ScanLogAggregateHelper({
      criteria: criteria,
      skip: skip || 0,
      limit: limit || 50000,
      sort: sort || '_id',
      sortOrder: sortOrder || 'desc',
    }).get();

    const rowData = ret.data?.map((x: any) => {
      return {
        gtin: x.gtinkey,
        product: x.productName,
        batch: x.batchNo,
        email: x.who,
        time: x.createdAt,
        device: x.appMode,
        interface: x.scanType,
        city: x?.location?.city,
        state: x?.location?.region,
        country: x?.location?.country,
        batchId: x.batch,
        productId: x.product,
        gtinId: x.gtin,
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName:
          criteria?.onlyBrandProtectionValid === true
            ? 'Transaction Table'
            : 'Brand Protection Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      ...ret,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'Credential')
  async getCredentialTable({
    criteria,
    limit,
    skip,
    sort,
    sortOrder,
  }: TableInput) {
    const networkOrg = await Brand.findOne({orgType: IOrgType.NETWORK});
    if (!networkOrg || !networkOrg?.did)
      throw new HttpErrors.NotFound(
        'network organization or its did not found',
      );
    const client_id = networkOrg.did;
    const key = 'credential';
    const {tableMetadata} = await this.getTableMetadata(key);

    const ret: any = await this.monarcha.findCredential({
      skip,
      take: limit,
      where: [
        // {
        //   column: 'type',
        //   value: ['verifiableCredential'],
        //   op: 'Equal',
        //   // not: true,
        // },
      ],
      order: [
        {
          column: 'issuanceDate',
          direction: 'DESC',
        },
      ],
    });
    const vcs = ret.credentials as VC[];

    const entries = vcs
      .map(x => x.verifiableCredential?.credentialSubject?.id)
      .filter(x => !!x) as string[];

    const holders: (IHolder & {wallet?: {did: string; pk: string}})[] =
      await this.walletClient.getUsersByEmailOrDID({
        client_id,
        entries,
      });

    const holdersFromLocal = await Holder.find({
      email: {$in: entries, $nin: holders.map(x => x.email)},
    });

    const rowData = vcs.map(x => {
      const id = x.verifiableCredential?.credentialSubject?.id?.trim();
      let user = holders.find(y => {
        const email = (y.email as string)?.toLowerCase().trim();
        return email === id || y.wallet?.did === id;
      });

      if (!user)
        user = holdersFromLocal.find(z => z.email?.toLowerCase().trim() === id);

      return {
        name: this.userService.getFullName(user as unknown as IUser),
        picture: x.verifiableCredential?.credentialSubject?.credentialLogo,
        email: user?.email,
        credentialName:
          x.verifiableCredential?.credentialSubject?.credentialName,
        issedat: x.verifiableCredential?.issuanceDate,
        more: 'View',
        status:
          x.verifiableCredential?.credentialStatus?.decoded?.[0]?.claim
            ?.currentStatus, //TODO
        // Active | Revoked | Disputed,
        id: x.verifiableCredential?.id?.split('/').pop(),
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Credential Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      currentPage: ret.currentPage,
      pageSize: ret.pageSize,
      totalCount: ret.totalCount,
      totalPages: ret.totalPages,
      data: {
        columnDefs: tableMetadata.columnDefs,
        rowData,
      },
    };
  }

  @authAndAuthZ('read', 'VP')
  async getPresentationTable({
    criteria,
    limit,
    skip,
    sort,
    sortOrder,
  }: TableInput) {
    const key = 'Presentation';
    const {tableMetadata} = await this.getTableMetadata(key);
    const ret: any = {data: []};
    const rowData = ret.data?.map((x: unknown) => {
      return {
        name: this.userService.getFullName(x as unknown as IUser),
        picture: '',
        email: '',
        bundleName: '',
        presentedat: '',
        validUntil: '',
        more: 'View',
        status: 'Active',
        id: '',
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Presentation Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      ...ret,
      data: {
        columnDefs: tableMetadata.columnDefs,
        rowData,
      },
    };
  }

  @authAndAuthZ('read', 'BatchLazyBindingParent')
  async getBatchLazyBindingParentTable({
    criteria,
    limit,
    skip,
    sort,
    sortOrder,
  }: TableInput) {
    const key = 'BatchLazyBindingParent';
    const {tableMetadata} = await this.getTableMetadata(key);

    const ret = await batchLazyBindingParentAggregateBuilder({
      criteria,
      skip,
      limit,
      sort,
      sortOrder,
    });
    const rowData = ret.data?.map((x: any, index: any) => {
      return {
        slNo: index + 1,
        _id: x?._id,
        description: x?.description,
        dateKey: x?.dateKey,
        counterRef: x?.counterRef,
        parentId: x?.parentId,
        variant: x?.Variant?.name,
        batch: x?.Batch?.name,
        product: x?.Item?.name,
        hash: x?.hash,
        createdBy: x?.User?.email,
        creatorRole: x?.creatorRole,
        creatorType: x?.creatorType,
        date: x?.createdAt,
        view: 'View',
        edit: 'Edit',
      };
    });
    // calculate total pages
    let totalPages = ret.count / ret.limit;
    if (this.isFloat(totalPages)) {
      totalPages = parseInt(totalPages.toString()) + 1;
    }
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'BatchLazyBindingParent Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      currentPage: ret.skip,
      pageSize: ret.limit,
      totalCount: ret.count,
      totalPages: totalPages,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'SAP')
  async getSapTable({criteria, limit, skip, sort, sortOrder}: TableInput) {
    const key = 'SAP';
    const {tableMetadata} = await this.getTableMetadata(key);
    // call sap client to get sap data
    const ret: any = await this.sapClient.listProvDump({
      criteria,
      limit,
      skip,
      sort,
      sortOrder,
    });

    const rowData = ret.data?.map((x: any) => {
      return {
        ...x,
        _id: x?._id,
        action: 'View',
        date: x?.createdAt,
        // inputDump: x?.inputDump,
        status: x?.status,
        error: x?.error?.message,
        gtin: x?.gtinKey,
        product: x?.productName,
        batch: x?.exciseBatchNo,
        unit: x?.plantDesc,
        fileName: x?.fileName,
      };
    });
    // calculate total pages
    let totalPages = ret.count / ret.limit;
    if (this.isFloat(totalPages)) {
      totalPages = parseInt(totalPages.toString()) + 1;
    }
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Sap Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      currentPage: ret.data.skip,
      pageSize: ret.limit,
      totalCount: ret.count,
      totalPages: totalPages,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'DISPATCH')
  async getMasterDispatchTable({
    criteria,
    limit,
    skip,
    sort,
    sortOrder,
  }: TableInput) {
    const key = 'MasterDispatch';
    const {tableMetadata} = await this.getTableMetadata(key);
    // call sap client to get sap data
    const ret: any = await this.sapClient.listMasterDispatch({
      criteria,
      limit,
      skip,
      sort,
      sortOrder,
    });

    const rowData = ret.data?.map((x: any) => {
      return {
        _id: x?._id,
        action: 'View',
        date: x?.createdAt,
        dispatchData: x?.dispatchData,
        dispatchDate: x?.dispatchDate,
        fileName: x?.fileName,
        status: x?.status,
        errorObj: x?.errorObj,
        s3Data: x?.s3Data,
        masterDispatchTracking: x?.MasterDispatchTracking
          ? x?.MasterDispatchTracking
          : {errorObj: x?.errorObj},
      };
    });
    // calculate total pages
    let totalPages = ret.count / ret.limit;
    if (this.isFloat(totalPages)) {
      totalPages = parseInt(totalPages.toString()) + 1;
    }
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Master Dispatch Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      currentPage: ret.data.skip,
      pageSize: ret.limit,
      totalCount: ret.count,
      totalPages: totalPages,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'DISPATCH')
  async getDispatchTable({criteria, limit, skip, sort, sortOrder}: TableInput) {
    const key = 'Dispatch';
    const {tableMetadata} = await this.getTableMetadata(key);
    // call sap client to get sap data
    const ret: any = await this.sapClient.listDispatch({
      criteria,
      limit,
      skip,
      sort,
      sortOrder,
    });
    // assign the plantDesc
    const fssaiData = await Fssai.find();
    ret.data = ret.data?.map((obj: {plant: string[]; plantDesc: string}) => {
      fssaiData.map(fssaiObj => {
        if (fssaiObj.plantCode == obj.plant) {
          obj.plantDesc = fssaiObj.plantDesc;
          return obj;
        }
      });
      return obj;
    });
    const rowData = ret.data?.map((x: any) => {
      return {
        _id: x?._id,
        action: 'View',
        date: x?.createdAt,
        dispatch: x?.dispatch,
        status: x?.status,
        masterDispatchId: x?.masterDispatchId,
        id: x?.id,
        sapCode: x?.sapCode,
        materialGroup: x?.materialGroup,
        groupDescription: x?.groupDescription,
        materialGroup4: x?.materialGroup4,
        packsize: x?.packsize,
        plant: x?.plant,
        batchno: x?.batchno,
        exciseBatchNumber: x?.exciseBatchNumber,
        batch: x?.exciseBatchNumber,
        mfgdate: x?.mfgdate,
        dispatchTracking: x?.DispatchTracking,
        gtin: x?.gtinKey,
        product: x?.productName,
        unit: x?.plantDesc,
      };
    });
    // calculate total pages
    let totalPages = ret.count / ret.limit;
    if (this.isFloat(totalPages)) {
      totalPages = parseInt(totalPages.toString()) + 1;
    }
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Dispatch Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      currentPage: ret.data.skip,
      pageSize: ret.limit,
      totalCount: ret.count,
      totalPages: totalPages,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'Report')
  async getReportTable({criteria, skip, limit, sort, sortOrder}: TableInput) {
    const key = 'Report';
    const {tableMetadata} = await this.getTableMetadata(key);

    const ret = await reportAggregator({
      criteria,
      skip,
      limit,
      sort,
      sortOrder,
    });
    const rowData = ret.data?.map((x: any) => {
      return {
        reportId: x?._id,
        reportLink: x?.reportLink,
        tableName: x?.tableName,
        status: x?.status,
        filters: x?.filters,
        totalEntries: x?.totalEntries,
        date: x?.createdAt,
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Report Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // calculate total pages
    let totalPages = ret?.count || 0 / ret?.limit;
    if (this.isFloat(totalPages)) {
      totalPages = parseInt(totalPages.toString()) + 1;
    }
    // in normal case return table data
    return {
      currentPage: ret.skip,
      pageSize: ret.limit,
      totalCount: ret.count || 0,
      totalPages: totalPages,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'SAP')
  async getTNTDump({thtDumpId}: {thtDumpId: string}) {
    const ret = await this.sapClient.getTntDump({
      thtDumpId,
    });

    return ret;
  }

  @authAndAuthZ('read', 'Feedback')
  async feedbackTable({criteria, limit, skip, sort, sortOrder}: TableInput) {
    const key = 'Feedback';
    const {tableMetadata} = await this.getTableMetadata(key);
    const ret = await feedbackAggregateBuilder({
      criteria,
      skip,
      limit,
      sort,
      sortOrder,
    });
    const isDetailsKeys: any = tableMetadata.columnDefs.map(obj => {
      if (obj?.isDetails) {
        return obj?.accessor;
      }
      return null;
    });
    const isDetailsKeysWithoutNull = isDetailsKeys.filter((element: null) => {
      return element !== null;
    });
    const rowData = ret.data?.map((x: any) => {
      const temp: any = {
        _id: x?._id,
        name: x?.userName,
        email: x?.email,
        location: x?.location?.city,
        rating: x?.rating,
        phone: x?.phone,
        comments: x?.comments,
        date: x?.createdAt,
        gtinKey: x?.Gtin?.gtinKey || x?.gtinKey,
        product: x?.Product?.name || x?.productName,
        batch: x?.Batch?.name,
        action: 'More',
        dateOfBirth: x?.dateOfBirth,
        anniversaryDate: x?.anniversaryDate,
      };
      // Add new keys here from details
      isDetailsKeysWithoutNull.map((key: string | number) => {
        temp[key] = x?.details?.[key];
      });
      return temp;
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Feedback Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      ...ret,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'Provenance')
  async provenanceTable({criteria, skip, limit, sort, sortOrder}: TableInput) {
    const key = 'Provenance';
    const {tableMetadata} = await this.getTableMetadata(key);
    const ret = await new ProvAggregateHelper({
      criteria: criteria,
      skip: skip || 0,
      limit: limit || 100000,
      sort: sort || '_id',
      sortOrder: sortOrder || 'desc',
    }).get();
    const rowData = ret.data?.map((x: any) => {
      return {
        provenanceId: x?._id,
        provenance: x?.name,
        description: x?.description,
        status: 'View',
        product: x?.Product?.name,
        batch: x?.Batch?.name,
        gtin: x?.Variant?.name,
        type: x?.ProvenanceTemplate?.type || '',
        productId: x?.Product?._id || x?.item,
        batchId: x?.Batch?._id || x?.batch,
        gtinId: x?.Variant?._id || x?.variant,
        mfgDate: x?.mfgDate,
        plantCode: x?.plantCode,
        // name: x?.name
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Provenance Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      ...ret,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'EntityRange')
  async entityRangeTable({criteria, limit, skip, sort, sortOrder}: TableInput) {
    const key = 'EntityRange'; //TODO: confirm key name
    const {tableMetadata} = await this.getTableMetadata(key);
    const ret = await entityRangeAggregateBuilder({
      criteria: {...(criteria || {})},
      skip,
      limit,
      sort,
      sortOrder,
    });

    const rowData = ret.data?.map((x: any) => {
      return {
        entityRangeId: x?._id,
        batch: x?.SerializationGroup?.batchNo,
        lowerLimit: x?.lowerBound,
        upperLimit: x?.upperBound,
        product: x?.Product?.name,
        productBatchNo: x?.Batch?.name,
        gtin: x?.Variant?.gtinKey,
        description: x?.description,
        action: 'Download CSV',
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'EntityRange Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      ...ret,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'SerializationGroup')
  async serializationGroupTable({
    criteria,
    skip,
    limit,
    sort,
    sortOrder,
  }: TableInput) {
    const key = 'SerializationGroup'; //TODO: confirm key name
    const {tableMetadata} = await this.getTableMetadata(key);
    const ret = await serializationGroupAggregateBuilder({
      criteria,
      skip,
      limit,
      sort,
      sortOrder,
    });
    const rowData = ret.data?.map(x => {
      return {
        serializationGroupId: x?._id,
        batch: x?.batchNo,
        maxItems: x?.maxItems,
        description: x?.description,
        action: 'Download CSV',
        status: x?.status,
        link: x?.link,
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'SerializationGroup Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      ...ret,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'Persona')
  async getPersonaTable({criteria, limit, skip, sort, sortOrder}: TableInput) {
    const key = 'Persona';
    const {tableMetadata} = await this.getTableMetadata(key);
    const persona = await Persona.findOne({_id: criteria.personaId});
    if (!persona)
      throw new HttpErrors.NotFound(
        `persona for id : ${criteria.personaId} not found`,
      );
    const ret = await new PersonaAggregateHelper({
      criteria: criteria,
      skip: skip || 0,
      limit: limit || 50000,
      sort: sort || '_id',
      sortOrder: sortOrder || 'desc',
    }).get();

    const rowData = ret.data?.map((x: any) => {
      return {
        name: capitalCase(x.users.name ?? ''),
        originalName: x.users?.name ?? '',
        email: x.users?.email,
        _id: x.users?._id,
        action: 'Remove',
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Persona Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    let totalPages = ret?.count || 0 / ret?.limit;
    if (this.isFloat(totalPages)) {
      totalPages = parseInt(totalPages.toString()) + 1;
    }
    // in normal case return table data
    return {
      currentPage: ret.skip / ret.limit + 1,
      pageSize: ret.limit,
      totalCount: ret.count,
      totalPages: totalPages,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  @authAndAuthZ('read', 'Campaign')
  async campaignTable({criteria, limit, skip, sort, sortOrder}: TableInput) {
    const key = 'Campaign';
    const {tableMetadata} = await this.getTableMetadata(key);

    const ret = await new CampaignAggregateHelper({
      criteria: criteria,
      skip: skip || 0,
      limit: limit || 500000,
      sort: sort || '_id',
      sortOrder: sortOrder || 'desc',
    }).get();

    const rowData = ret.data?.map((x: any) => {
      return {
        campaignId: x?._id,
        name: x?.name,
        description: x?.description,
        status: x?.status,
        data: x?.data,
        campaignMapping: x?.CampaignMapping,
      };
    });
    // if download request come we just return success and initiate donwload request in background
    if (criteria?.download) {
      // create initial report object
      const reportData = {
        filters: {criteria, limit, skip, sort, sortOrder},
        tableName: 'Campaign Table',
        totalEntries: ret.count,
        rowData: rowData,
        columnDefs: tableMetadata.columnDefs,
      };
      // initiate report download
      this.reportCommonServ.initiateReportDownload(reportData);
      return {
        data: {
          success: true,
          message:
            'Download request accepted. Please check in the Report tab after a few minutes.',
        },
      };
    }
    // in normal case return table data
    return {
      ...ret,
      data: {
        rowData,
        columnDefs: tableMetadata.columnDefs,
      },
    };
  }

  async getTableMetadata(key: string) {
    // moving this from private to public, we are using it in multiple services.
    const tableMetadata = await DashboardTable.findOne({key}).lean();
    if (!tableMetadata) {
      log.error(`CRITICAL: Table metadata not found for ${key}`);
      throw new HttpErrors.InternalServerError(`Oops! , something went wrong`);
    }
    return {tableMetadata};
  }

  //  ----------------private methods --------------------
  private getHolderStatusLabel(status?: string) {
    switch (status) {
      case HolderStatus.INVITED:
        return 'Invited';
      case HolderStatus.WALLET_REGISTERED:
        return 'Wallet Registered';
      case HolderStatus.NOT_INVITED:
        return 'Not Invited';

      default:
        return 'Not Invited';
    }
  }
  private getuserStatusAndAction(userData: any) {
    let status = '';
    let action = '';
    if (userData.emailVerified && userData.accessForbidden) {
      status = 'Deactivated';
      action = 'Activate';
    } else if (!userData.emailVerified && !userData.accessForbidden) {
      status = 'Invited';
      action = 'ReInvite';
    } else if (userData.emailVerified && !userData.accessForbidden) {
      status = 'Active';
      action = 'Deactivate';
    }
    return {status: status, action: action};
  }
  private isFloat(n: any) {
    return Number(n) === n && n % 1 !== 0;
  }
}
