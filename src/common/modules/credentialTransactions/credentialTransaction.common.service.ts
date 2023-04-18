/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {log, pretty} from '@/utils';
import {bind, BindingScope, Context, inject} from '@loopback/context';
import {service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  Brand,
  IBrand,
  IOrgType,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import _ from 'lodash';
import {CredentialConfig} from '../credential';
import {IssueProvStepCred} from '../provenance/issueProvStepCred.helper';
import {TemplateStyle} from '../templateStyle';
import {UpdateLog} from '../updateLogs/updatelog.model';
import {CredTransaction} from './credentialTransaction.model';

@bind({scope: BindingScope.SINGLETON})
export class CredTranCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('config.credential') private credentialConfig: CredentialConfig,
    @inject('env') private env: any,
    @service(MonarchaClient)
    private monarchaClient: MonarchaClient,
  ) {
    super(ctx);
  }

  async createCredTran(credTranReqArr: any) {
    // create record in credential transaction
    try {
      const credTranMany = await CredTransaction.insertMany(credTranReqArr);
      return credTranMany;
    } catch (err: any) {
      // log.error(" aor acreateProv")
      log.error(`error at createCredTran err ${pretty(err)}`);
      throw new HttpErrors.UnprocessableEntity(err.message);
    }
  }

  @authAndAuthZ('update', 'Provenance')
  async updateStepCredential({
    _id,
    data,
  }: {
    _id: string;
    data: {
      images?: string[];
      evidences: string[];
      keyvals: {key: string; value: string}[];
      // geoJSON: any;
    };
  }) {
    const accessor = await this.getAccessUser();
    const cred = await CredTransaction.findOne({_id});
    if (!cred) throw new HttpErrors.NotFound(`Credential id: ${_id} not found`);
    const credentialSubject: object = {
      ...cred?.credentialContent?.credentialSubject,
    };
    console.log('before updateStepCredential => cred', pretty(cred?.toJSON()));
    data?.keyvals?.forEach(x => {
      if (x.key === 'credentialName') return;
      if (!x.key) return;
      _.set(credentialSubject, x.key, x.value);
    });

    // const credentialSubject = _.omit(
    //   data.credentialSubject,
    //   'credentialSubject',
    // );

    const $set = {};
    const geoJSONString = data?.keyvals?.find(x => x?.key === 'geoJSON')?.value;
    if (geoJSONString) {
      try {
        const parsedGeoJSON = JSON.parse(geoJSONString);
        _.set($set, 'credentialContent.geoJSON', parsedGeoJSON);
      } catch (err) {
        throw new HttpErrors.BadRequest(
          `unable to parse geoJSON: ${geoJSONString}`,
        );
      }
    }
    if (credentialSubject)
      _.set($set, 'credentialContent.credentialSubject', credentialSubject);
    if (data.evidences)
      _.set($set, 'credentialContent.evidences', data.evidences);
    if (data.images) _.set($set, 'credentialContent.images', data.images);

    console.log('updateStepCredential => $set', $set);
    const newCred = await CredTransaction.findOneAndUpdate(
      {_id},
      {$set},
      {new: true},
    );
    console.log(
      'after updateStepCredential => cred',
      pretty(newCred?.toJSON()),
    );
    const oplog = await UpdateLog.create({
      opName: 'updateStepCredential',
      before: cred,
      after: newCred,
      who: accessor?.user?.email,
      user: accessor?.user?._id,
      metadata: {
        id: _id,
      },
    });
    this.issueSingleProvCred(_id)
      .then((x: any) => {
        log.info(`credential issued for id ${_id}`);
      })
      .catch((err: any) => {
        console.log('err', err);
        log.error(
          `error during updateStepCredential id : ${_id} ,${err.message}`,
        );
      });
    return 'initiated';

    //  issue credentials
  }

  private async issueSingleProvCred(credTxId: string) {
    const user = (await this.getAccessUser()).user || null;
    const credentialKeyValsArr = [];
    let credentialKeyValJson: any = null;
    // --------------------------------------------
    const credTxnObj = await CredTransaction.findOne({
      _id: credTxId,
    });
    const tempStyle = await TemplateStyle.findOne({
      $or: [
        {extTempId: credTxnObj?.extTempId},
        {_id: credTxnObj?.credentialTemplate},
      ],
    });
    if (!tempStyle) {
      throw new HttpErrors.BadRequest(
        `template credentialName: ${credTxnObj?.credentialContent.credentialSubject.credentialName} extTempId:${credTxnObj?.extTempId} not found`,
      );
    }
    for (let item in credTxnObj?.credentialContent.credentialSubject) {
      credentialKeyValJson = {};
      credentialKeyValJson.key = item;
      credentialKeyValJson.value =
        credTxnObj?.credentialContent.credentialSubject[item];
      credentialKeyValsArr.push(credentialKeyValJson);
    }

    if (!_.isEmpty(credTxnObj?.credentialContent?.evidences)) {
      const tempEvi = credTxnObj?.credentialContent?.evidences?.filter(x =>
        _.isString(x),
      );
      tempEvi?.forEach(x => {
        credentialKeyValsArr.push({
          key: 'evidence',
          value: x,
        });
      });
    }

    const org: IBrand = await Brand.findOne({orgType: IOrgType.NETWORK});
    if (!org) throw new HttpErrors.NotFound(`org not found`);

    const issueProvCredServ = new IssueProvStepCred(
      tempStyle,
      org,
      credentialKeyValsArr,
      org,
      user,
      this.monarchaClient,
      this.credentialConfig,
      false,
    );
    const ret = await issueProvCredServ.issueCred();
    // update klefkiID in credential transaction
    await CredTransaction.updateOne(
      {
        _id: credTxId,
      },
      {
        klefki_id: ret.credential.id.split('/').pop(),
      },
    );
  }
}
