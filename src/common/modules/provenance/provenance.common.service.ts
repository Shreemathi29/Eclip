/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {FlinstoneClient} from '@/clients/rest/flinstone.client';
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {AWSService} from '@/common/services/aws-s3.service';
import {constants} from '@/utils/constants';
import {log, pretty} from '@/utils/logging';
import {inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Brand} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import _, {upperCase} from 'lodash';
import mongoose from 'mongoose';
import {Context} from 'vm';
import {Batch} from '../batch/batch.model';
import {CredentialConfig} from '../credential';
import {CredTransaction} from '../credentialTransactions';
import {DashboardTableCommonService} from '../dashboardTable/dashboardTable.common.service';
import {TemplateStyle} from '../templateStyle';
import {IUser} from '../users/user.model';
import {IssueManyProvCredService} from './issueManyProvCred.helper';
import {IssueManyProvDispatchCredService} from './issueManyProvDispatchCred.helper';
import {IssueProvStepCred} from './issueProvStepCred.helper';
import {Provenance} from './provenance.model';
export class ProvenanceCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.DashboardTableCommonService')
    private dbTableCommonServ: DashboardTableCommonService,
    @service(MonarchaClient) private monarchaClient: MonarchaClient,
    @service(AWSService) private awsService: AWSService,
    @service(FlinstoneClient) private flinstoneClient: FlinstoneClient,
    @inject('config.credential') private credentialConfig: CredentialConfig,
    @inject('env') private env: any,
  ) {
    super(ctx);
  }
  // external
  async issueProvCred({provId}: {provId: string}) {
    const helper = new IssueManyProvCredService(
      provId,
      this.monarchaClient,
      this.credentialConfig,
    );
    await helper.start();
    return {
      msg: 'process initiated',
    };
  }

  // external
  async issueProvCredSteps({
    provId,
    credIds,
  }: {
    provId: string;
    credIds: [string];
  }) {
    const helper = new IssueManyProvCredService(
      provId,
      this.monarchaClient,
      this.credentialConfig,
      credIds,
    );
    await helper.start();
    return {
      msg: 'process initiated',
    };
  }

  async issueProvDispatchCred({
    provId,
    credTrans,
  }: {
    provId: string;
    credTrans: any;
  }) {
    const helper = new IssueManyProvDispatchCredService(
      provId,
      credTrans,
      this.monarchaClient,
      this.credentialConfig,
    );
    await helper.start();
    return {
      msg: 'process initiated',
    };
  }

  private async removeNonZeroValues(credTxn: any) {
    // alter perctVolPerVol to Percent Vol.
    const credSub: any = await this.alterCredSubKeys(
      credTxn?.credentialContent?.credentialSubject,
    );
    const credTemplate = await TemplateStyle.findOne({
      _id: credTxn?.credentialTemplate?._id,
    });
    const allowedNonZeros: any = [0, '0', 0.0, '0.0'];
    for (const item in credSub) {
      // corner case because we are updating keys before deletion, credential template has not new key
      if (
        item === 'Percent Vol.' &&
        credTemplate?.zeroFields?.includes('perctVolPerVol') &&
        allowedNonZeros.includes(credSub[item])
      ) {
        delete credSub[item];
      } else if (
        allowedNonZeros.includes(credSub[item]) &&
        credTemplate?.zeroFields?.includes(item)
      ) {
        delete credSub[item];
      }
    }
    return credTxn;
  }

  private async removeEmptyValues(credTxn: any) {
    // alter perctVolPerVol to Percent Vol.
    const credSub: any = credTxn?.credentialContent?.credentialSubject;
    for (const item in credSub) {
      if (credSub[item] === '' || credSub[item] === null) {
        delete credSub[item];
      }
    }
    return credTxn;
  }

  private async alterCredSubKeys(credSub: any) {
    // alter perctVolPerVol to Percent Vol.
    if (credSub && 'perctVolPerVol' in credSub) {
      credSub['Percent Vol.'] = credSub?.perctVolPerVol;
      delete credSub?.perctVolPerVol;
    }
    return credSub;
  }

  async updateProv(provData: any) {
    try {
      const dispatchcredsIds = provData.credTxArr
        .filter((x: {extTempId: string}) => x.extTempId === 'Dispatch')
        .map((x: {_id: any}) => x._id);

      const provenance = await Provenance.findOne({
        _id: provData.provId,
      });

      if (!provenance) {
        throw new HttpErrors.NotFound('Provenance not found at trag side');
      }

      const provSteps = provenance?.provSteps.map(step => {
        if (['fg', 'finishedgood'].includes(step?.title?.toLowerCase() || '')) {
          step.credTxs = step.credTxs.concat(dispatchcredsIds || []);
          return step;
        }
        return step;
      });
      await Provenance.updateOne(
        {
          _id: provenance?._id,
        },
        {
          provSteps: provSteps,
        },
      );
      return provenance;
    } catch (err: any) {
      log.error(`error at createProv err ${pretty(err)}`);
      throw new HttpErrors.UnprocessableEntity(err.message);
    }
  }

  async createProv(provData: any) {
    //! from sap
    // provenance name should be unique
    // TODO: check later
    // const provenance = await Provenance.findOne({name: provData.name});
    // if (provenance) {
    //   throw new HttpErrors.BadRequest('Duplicate provenance name');
    // }

    // find variant
    try {
      const variant = await Variant.findOne({gtinKey: provData.gtinKey});
      if (!variant) {
        throw new HttpErrors.NotFound(constants.MESSAGES.VARIANT_NOT_FOUND);
      }
      // find item
      const item = await Item.findOne({_id: variant.item});
      if (!item) {
        throw new HttpErrors.NotFound(constants.MESSAGES.PRODUCT_NOT_FOUND);
      }
      // find batch, If not found create a batch
      // let batch = await Batch.findOne({
      //   name: provData.exciseBatchNo,
      //   variants: {
      //     $in: [variant._id],
      //   },
      // });
      // if (!batch) {
      //   const batchData = {
      //     name: provData.exciseBatchNo,
      //     variants: [variant._id],
      //     description: provData.batchData?.batchDesc || '',
      //     item: variant.item,
      //     creatorUser: provData.creatorUser,
      //     manufactureDate: new Date(),
      //   };
      //   batch = await Batch.create(batchData);
      // }
      // create a provenance
      let batch = await Batch.findOneAndUpdate(
        {
          name: provData.exciseBatchNo,
          variants: {
            $in: [variant._id],
          },
        },
        {
          $setOnInsert: {
            name: provData.exciseBatchNo,
            variants: [variant._id],
            description: provData.batchData?.batchDesc || '',
            item: variant.item,
            creatorUser: provData.creatorUser,
            manufactureDate: new Date(),
          },
        },
        {new: true, upsert: true},
      );
      provData.item = variant.item;
      provData.variant = variant._id;
      provData.batch = batch._id;
      provData.sapBatchNo = provData.sapBatchNo;
      const createProv = await Provenance.create(provData);
      return createProv;
    } catch (err: any) {
      // log.error(" aor acreateProv")
      log.error(`error at createProv err ${pretty(err)}`);
      throw new HttpErrors.UnprocessableEntity(err.message);
    }
  }

  @authAndAuthZ('read', 'Provenance')
  async getProvenance(_id: mongoose.Types.ObjectId) {
    const provenance: any = await Provenance.findById(_id);
    if (!provenance) {
      throw new HttpErrors.NotFound('Provenance not found');
    }
    const provStArray: any = [];
    for (let i = 0; i < provenance.provSteps.length; i++) {
      const obj = await this.getProvSteps(provenance.provSteps[i]);
      provStArray.push(obj);
    }
    provenance._doc['provSteps'] = provStArray;

    /* TODO: Due to timeout issue in flinstoneClient service
    we are not adding credentialTemplate key.  */

    return provenance;
  }

  @authAndAuthZ('read', 'Provenance')
  private credentialSubjectKeyVals(credentialContent: any) {
    if (!credentialContent?.credentialSubject) return null;
    const credSub = credentialContent?.credentialSubject as {
      [key: string]: string | string[];
    };
    const keyVals = Object.entries(credSub)?.map(x => {
      return {
        label: _.capitalize(x?.[0]),
        key: x?.[0],
        value: (_.isString(x?.[1]) && x?.[1]) || null,
        values: (Array.isArray(x?.[1]) && x?.[1]) || null,
      };
    });
    return keyVals;
  }
  @authAndAuthZ('read', 'Provenance')
  private async getProvSteps(provStepObj: any) {
    const newObj: any = {};
    if (provStepObj.parentCredTx) {
      let parentCredTxn: any = await CredTransaction.findById(
        provStepObj.parentCredTx,
      );
      parentCredTxn = await this.removeEmptyValues(parentCredTxn);
      parentCredTxn = await this.removeNonZeroValues(parentCredTxn);
      if (parentCredTxn?.credentialContent?.credentialSubject) {
        parentCredTxn['credentialSubjectKeyVals'] =
          this.credentialSubjectKeyVals(parentCredTxn?.credentialContent);
      }
      newObj['parentCredTx'] = parentCredTxn;
    }
    const credTxnArray: any = await CredTransaction.find({
      _id: {$in: provStepObj.credTxs},
    });
    if (provStepObj.credTxs) {
      let crdtxn = null;
      for (let i = 0; i < credTxnArray.length; i++) {
        crdtxn = credTxnArray[i];
        crdtxn = await this.removeEmptyValues(crdtxn);
        crdtxn = await this.removeNonZeroValues(crdtxn);
        if (crdtxn?.credentialContent?.credentialSubject) {
          crdtxn['credentialSubjectKeyVals'] = this.credentialSubjectKeyVals(
            crdtxn?.credentialContent,
          );
        }
      }
    }
    newObj['credTxs'] = credTxnArray;
    newObj['title'] = provStepObj.title;
    newObj['subtitle'] = provStepObj.subtitle;
    return newObj;
  }

  @authAndAuthZ('create', 'Provenance')
  async issueProvCredential({
    credentialKeyVals,
    credTempKey,
  }: {
    credentialKeyVals: {key: string; value: string}[];
    credTempKey: string;
  }) {
    const user = (await this.getAccessUser()).user as IUser;
    const org = await Brand.findOne({_id: user?.organization});
    if (!org)
      throw new HttpErrors.NotFound(`org for user ${user?.email} not found`);
    const tempStyle = await TemplateStyle.findOne({templateKey: credTempKey});
    if (!tempStyle)
      throw new HttpErrors.NotFound(`templateKey ${credTempKey} not found`);

    const issueProvCredServ = new IssueProvStepCred(
      tempStyle,
      org,
      credentialKeyVals,
      org,
      user,
      this.monarchaClient,
      this.credentialConfig,
      true,
    );
    const ret = await issueProvCredServ.issueCred();
    return ret;
  }

  @authAndAuthZ('create', 'Provenance')
  async createProvenanceFromProvTemp(provObj: {
    name: string;
    provenanceTemplate: mongoose.Types.ObjectId;
    provSteps: {credTxs: any; parentCredTx: any; title: any; subtitle: any}[];
  }) {
    // check if provenance req is duplicate
    const findProvData = await Provenance.findOne({name: provObj.name});
    if (findProvData) {
      throw new HttpErrors.BadRequest(
        `Provenance already exists for given name ${provObj.name}`,
      );
    }
    // Create credential transaction for provenance steps and prepare prov data
    let provData: any = {};
    provData.name = provObj.name;
    provData.provenanceTemplate = provObj.provenanceTemplate;
    provData.provSteps = [];
    let validationErrors = '';
    for (let i = 0; i < provObj.provSteps.length; i++) {
      let level = provObj.provSteps[i];
      const provStepObj: any = {};
      // Convert credeTxs and parentCredTx in proper format before inserting
      // in same iteration collecting validation errors
      const newCredTxsArr = level.credTxs.map(function (credTx: any) {
        let templateName =
          credTx.credentialContent.credentialSubject.credentialName.value;
        // set geoJSON in string format for each cred tran cred subject
        credTx.credentialContent.credentialSubject.geoJSON = {
          type: 'string',
          required: false,
          value: JSON.stringify(credTx.credentialContent?.geoJSON),
        };
        for (let item in credTx.credentialContent.credentialSubject) {
          // check and update validation errors
          if (
            credTx.credentialContent.credentialSubject[item].required ===
              true &&
            credTx.credentialContent.credentialSubject[item].value === ''
          ) {
            validationErrors =
              validationErrors +
              `${templateName}:${upperCase(item)} is required,`;
          }
          // Convert credeTxs in proper format before inserting
          if (credTx.credentialContent.credentialSubject[item].value !== '') {
            credTx.credentialContent.credentialSubject[item] =
              credTx.credentialContent.credentialSubject[item].value;
          }
        }
        return {
          credentialTemplate: credTx.credentialTemplate,
          credentialContent: credTx.credentialContent,
        };
      });
      let parentTemplateName =
        level.parentCredTx.credentialContent.credentialSubject.credentialName
          .value;
      // set geoJSON in string format for parent cred tran cred subject
      level.parentCredTx.credentialContent.credentialSubject.geoJSON = {
        type: 'string',
        required: false,
        value: JSON.stringify(level.parentCredTx.credentialContent?.geoJSON),
      };
      for (let item in level.parentCredTx.credentialContent.credentialSubject) {
        // check and update the validation errros
        if (
          level.parentCredTx.credentialContent.credentialSubject[item]
            .required === true &&
          level.parentCredTx.credentialContent.credentialSubject[item].value ===
            ''
        ) {
          validationErrors =
            validationErrors +
            `${parentTemplateName}:${upperCase(item)} is required`;
        }
        // Convert parentCredTx in proper format before inserting
        if (
          level.parentCredTx.credentialContent.credentialSubject[item].value !==
          ''
        ) {
          level.parentCredTx.credentialContent.credentialSubject[item] =
            level.parentCredTx.credentialContent.credentialSubject[item].value;
        }
      }
      // throw errors if validation errors found
      if (validationErrors.length > 0) {
        throw new HttpErrors.BadRequest(validationErrors);
      }
      // insert all cred txns
      const credTxsRes = await CredTransaction.insertMany(newCredTxsArr, {
        ordered: false,
      });
      const parentCredTxRes = await CredTransaction.create(level.parentCredTx);
      provStepObj.title = level.title;
      provStepObj.subtitle = level.subtitle;
      provStepObj.parentCredTx = parentCredTxRes._id;
      provStepObj.credTxs = credTxsRes.map(credTx => credTx._id);
      provData.provSteps.push(provStepObj);
    }
    // create provenance
    const provenanceRes = await Provenance.create(provData);
    // Initiate issue prov credential
    await this.issueProvCred({provId: provenanceRes._id});
    return provenanceRes;
  }

  @authAndAuthZ('update', 'Provenance')
  async updateProvenance(provObj: {
    provId: mongoose.Types.ObjectId;
    type: string;
    unlink: boolean;
    data: {
      product: mongoose.Types.ObjectId;
      batch: mongoose.Types.ObjectId;
      gtin: mongoose.Types.ObjectId;
    };
  }) {
    // find provenance
    const findProvData = await Provenance.findOne({_id: provObj.provId});
    if (!findProvData) {
      throw new HttpErrors.NotFound(`Provenance not found`);
    }
    // find variant
    const variant = await Variant.findOne({_id: provObj.data.gtin});
    if (!variant) {
      throw new HttpErrors.NotFound(constants.MESSAGES.VARIANT_NOT_FOUND);
    }
    // find item
    const item = await Item.findOne({_id: provObj.data.product});
    if (!item) {
      throw new HttpErrors.NotFound(constants.MESSAGES.PRODUCT_NOT_FOUND);
    }
    // find batch
    let batch = await Batch.findOne({
      _id: provObj.data.batch,
      variants: {
        $in: [provObj.data.gtin],
      },
    });
    if (!batch && provObj.type === 'Batch') {
      throw new HttpErrors.NotFound(constants.MESSAGES.BATCH_NOT_FOUND);
    }

    // check default batch is exists or not when provenance type is product. If not create a default batch
    // default batch is combination of batch and requested gtin
    let defaultBatch = await Batch.findOne({
      name: 'default',
      variants: {
        $in: [provObj.data.gtin],
      },
    });
    if (!defaultBatch && provObj.type === 'Product') {
      const batchData = {
        name: 'default',
        variants: [provObj.data.gtin],
        item: provObj.data.product,
        creatorUser: (await this.getAccessUser())?.user?._id,
        manufactureDate: new Date(),
      };
      defaultBatch = await Batch.create(batchData);
    }

    // If user forcely asked to unlink other provenance
    if (provObj.type === 'Product' && provObj.unlink === true) {
      // find other prov which is attached with default batch
      const provForDefaultBatch = await Provenance.updateMany(
        {item: provObj.data.product, batch: defaultBatch?._id},
        {
          $set: {
            batch: null,
          },
        },
      );
      log.info('Unlinked other provenances for default batch');
    }

    const provenanceRes = await Provenance.findOneAndUpdate(
      {
        _id: provObj.provId,
      },
      {
        variant: provObj.data.gtin,
        batch: provObj.data.batch || defaultBatch?._id,
        item: provObj.data.product,
      },
      {new: true},
    );
    return provenanceRes;
  }

  @authAndAuthZ('update', 'Provenance')
  async uploadFile(fileObj: {name: string; data: string}) {
    const extention = fileObj.name.split('.').pop();
    const ret = await this.awsService.uploadFile({
      data: fileObj.data,
      encoding: 'base64',
      bucket: this.env.AWS_S3_BUCKET_NAME,
      mimeType: `image/${extention}`,
      fileName: fileObj.name,
      BufferFromString: true,
    });
    return ret.url;
  }

  @authAndAuthZ('read', 'Provenance')
  async checkProvForDefaultBatch(gtin: mongoose.Types.ObjectId) {
    let defaultBatch = await Batch.findOne({
      name: 'default',
      variants: {
        $in: [gtin],
      },
    });
    const provForDefaultBatch = await Provenance.find({
      batch: defaultBatch?._id,
    });
    if (defaultBatch && provForDefaultBatch.length > 0) {
      return {
        exists: true,
        message: 'Warning: Default batch already linked with other provenance',
      };
    }
    return {
      exists: false,
      message: 'No provenance linked with default batch',
    };
  }
}
