import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {log} from '@/utils/logging';
import {HttpErrors} from '@loopback/rest';
import {
  Brand,
  IBrand,
  IOrgType,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import _ from 'lodash';
import {CredentialConfig} from '../credential';
import {CredTransaction} from '../credentialTransactions';
import {CredHash} from '../credHash/credHash.model';
import {ProvenanceTracking} from '../provTracking/provTracking.model';
import {TemplateStyle} from '../templateStyle/templateStyle.model';
import {IUser} from '../users/user.model';
import {augmentError, logStage} from './issueManyProvCred.utils';
import {IssueProvStepCred} from './issueProvStepCred.helper';
import {IProvenance, Provenance} from './provenance.model';

const hash = require('object-hash');

export class IssueManyProvCredService {
  private provenance: IProvenance;
  private credTxnArr: string[] = [];
  private credTxnUniqueArr: string[] = [];
  private provTrackDocId: string;
  org: IBrand;
  user: IUser | null = null;
  constructor(
    private provId: string,
    private monarchaClient: MonarchaClient,
    private credentialConfig: CredentialConfig,
    private credIds?: [string],
  ) {}

  async start() {
    await this.retrieveProv();
    this.generateNoBlock();
  }

  private async generateNoBlock() {
    this.generate()
      .then(x => {
        log.info(`success, credential issued for provenance ${this.provId}`);
      })
      .catch(err => {
        log.error(
          `error .while issuing prov credentials ${this.provId} .==> ${err.msg}`,
        );
        console.log('ProvDumpHelperService err', err);

        ProvenanceTracking.findOneAndUpdate(
          {_id: this.provTrackDocId},
          {
            $set: {status: 'Failed'},
            $push: {
              errors_list: {
                msg: err.message,
                // credTxId: this.credTxnUniqueArr[i],
              },
            },
          },
        )
          .then(x => {
            console.log('successfully logged error to db');
          })
          .catch(er => {
            log.error(
              `error while updating error to prov doc provId: ${this.provId}`,
            );
          });
      });
  }

  private async generate() {
    await this.createTrackingDoc();
    await this.prepareUniqueCredTranArray();
    await this.retrevCredTran();
    await this.getUserAndOrg();
    await this.mapCredentialTemplate();
    await this.issueProvCreds();
  }

  @augmentError
  @logStage
  private async retrieveProv() {
    const provenance = await Provenance.findOne({_id: this.provId});
    if (!provenance) {
      log.info(`Provenance not found ${this.provId}`);
      throw new HttpErrors.NotFound('Provenance not found');
    }
    this.provenance = provenance;
  }

  @augmentError
  @logStage
  private async prepareUniqueCredTranArray() {
    if (this.credIds && this.credIds?.length > 0) {
      this.credTxnUniqueArr = [...new Set(this.credIds)];
      return;
    }
    for (let i = 0; i < this.provenance.provSteps.length; i++) {
      let chidlCredTxnArr = [];
      this.credTxnArr.push(
        this.provenance.provSteps[i].parentCredTx.toString(),
      );
      chidlCredTxnArr = this.provenance.provSteps[i].credTxs.map(
        (item: {toString: () => any}) => item.toString(),
      );
      this.credTxnArr.push(...chidlCredTxnArr);
      this.credTxnUniqueArr = [...new Set(this.credTxnArr)];
    }

    await ProvenanceTracking.findOneAndUpdate(
      {_id: this.provTrackDocId},
      {
        $set: {nonIssuedCredTran: this.credTxnUniqueArr},
      },
    );
  }

  @augmentError
  @logStage
  private async retrevCredTran() {
    // first find all credential transactions
    let credentialTransaction = null;
    for (let i = 0; i < this.credTxnUniqueArr.length; i++) {
      credentialTransaction = await CredTransaction.findOne({
        _id: this.credTxnUniqueArr[i],
      });
      if (!credentialTransaction) {
        log.info(
          `Credential transaction  not found ${this.credTxnUniqueArr[i]}`,
        );
        throw new HttpErrors.NotFound('Credential transaction not found');
      }
    }
  }

  @augmentError
  @logStage
  private async createTrackingDoc() {
    const provTrack = await ProvenanceTracking.create({
      provenanceId: this.provId,
      status: 'Created',
      // nonIssuedCredTran: this.credTxnUniqueArr,
    });
    this.provTrackDocId = provTrack._id;
  }

  @augmentError
  @logStage
  private async getUserAndOrg() {
    //TODO: org and user are static, need to repalce this later
    const brand: IBrand = await Brand.findOne({orgType: IOrgType.NETWORK});
    // const user: IUser = (await User.findOne({
    //   email: 'admin@vlinder.io',
    // })) as IUser;
    // for now assume default user
    if (!brand) throw new HttpErrors.NotFound(`org not found`);
    this.org = brand;
  }

  @augmentError
  @logStage
  private async mapCredentialTemplate() {
    for (let i = 0; i < this.credTxnUniqueArr.length; i++) {
      const credTxnObj = await CredTransaction.findOne({
        _id: this.credTxnUniqueArr[i],
      });
      let templateStyleObj = await TemplateStyle.findOne({
        $or: [
          {extTempId: credTxnObj?.extTempId},
          {_id: credTxnObj?.credentialTemplate},
        ],
      });
      if (!templateStyleObj) {
        log.warn(
          `credentialTemplate not found for extTempid : ${credTxnObj?.extTempId} switching to Others`,
        );
        templateStyleObj = await TemplateStyle.findOne({
          extTempId: 'Others',
        });
      }

      if (templateStyleObj) {
        await CredTransaction.findOneAndUpdate(
          {_id: this.credTxnUniqueArr[i]},
          {
            $set: {
              credentialTemplate: templateStyleObj._id,
              'credentialContent.credentialSubject.credentialName':
                templateStyleObj.labelKey,
            },
          },
        );
      } else {
        log.info(
          `Template style not found for credTran ${this.credTxnUniqueArr[i]}`,
        );
      }
    }
  }

  @augmentError
  @logStage
  private async issueProvCreds() {
    // let issueProvCredServ = null;
    // let ret = null;
    for (let i = 0; i < this.credTxnUniqueArr.length; i++) {
      const credTxId = this.credTxnUniqueArr[i];
      try {
        log.info(`issuing credential for id: ${credTxId}`);
        // *--------------------
        await this.issueSingleProvCred(credTxId);
        // *------------------------------------
        log.info(`successfully issued credential for id: ${credTxId}`);
      } catch (error: any) {
        log.error(
          `Error while issue credential for cred trxn ${credTxId}, errMsg:${error.message}`,
        );
        // update provenance tracking document
        await ProvenanceTracking.findOneAndUpdate(
          {_id: this.provTrackDocId},
          {
            status: 'Failed',
            $push: {
              errors_list: {
                msg: error.message,
                credTxId,
              },
            },
          },
        );
        throw new HttpErrors.InternalServerError(
          `Error while issue credential for credTran ${credTxId}`,
        );
      }
    }
  }

  private async issueSingleProvCred(credTxId: string) {
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

    const issueProvCredServ = new IssueProvStepCred(
      tempStyle,
      this.org,
      credentialKeyValsArr,
      this.org,
      this.user,
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

    // update provenance tracking document
    await ProvenanceTracking.findOneAndUpdate(
      {_id: this.provTrackDocId},
      {
        $push: {issuedCredTran: credTxId},
        $pull: {nonIssuedCredTran: credTxId},
      },
    );
    // --------------------
    // ---------------------
    const x = credTxnObj;
    let thingToHash = null;
    if (
      x?.credentialContent.credentialSubject?.credentialName === 'dispatch' ||
      x?.credentialContent.credentialSubject?.credentialName === 'Others'
    ) {
      thingToHash = x?.credentialContent.credentialSubject;
    } else {
      thingToHash = {
        sap: x?.credentialContent.credentialSubject?.code,
        description: x?.credentialContent.credentialSubject?.description,
        batchNo: x?.credentialContent.credentialSubject?.batchNo,
      };
    }
    const data = {
      _id: x?._id,
      hash: hash(thingToHash),
    };
    if (x?._id) {
      const ret = await CredHash.findOneAndUpdate({_id: x?._id}, data, {
        new: true,
        upsert: true,
      });
    } else {
      log.warn(`unable to create credHash for ${credTxnObj}`);
    }
    // --------------
    // -----------------
  }
}
