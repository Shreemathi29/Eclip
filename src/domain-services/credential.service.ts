/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {FlinstoneClient} from '@/clients/rest/flinstone.client';
import {MonarchaClient, VCredential} from '@/clients/rest/monarcha.client';
import {PowerpuffClient} from '@/clients/rest/powerpuff.client';
import {HolderFromDIDOrEmail, WalletClient} from '@/clients/rest/wallet.client';
import {
  CredentialCommonService,
  CredentialConfig,
  CredentialStatus,
  CredentialViewService,
  TransportService,
} from '@/common/modules/credential';
import {HolderCredential} from '@/common/modules/credential/holder-credential';
import {CredTransaction} from '@/common/modules/credentialTransactions/credentialTransaction.model';
import {HolderCommonService} from '@/common/modules/holder/holder.common.service';
import {Role} from '@/common/modules/role/role.model';
import {
  authAndAuthZ,
  authenticateMethod,
} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {AWSService} from '@/common/services/aws-s3.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {bind, BindingScope, inject, service} from '@loopback/core';
import _ from 'lodash';
import moment from 'moment';
import {Context} from 'vm';
import {OrganizationService} from '.';
import {WalletUser} from '../clients/rest/wallet.client';

export interface IssueCredentialHolderInput {
  email: string;
  credentialContent: {key: string; value: string}[];
  credentialTemplateId: string;
  sendEmail: boolean;
  sendPN: boolean;
  isWalletRegMandatory: boolean;
}

export interface InitiateTransportInput {
  email: string;
  tag: string;
  sendEmail: boolean;
  sendPN: boolean;
}

@bind({scope: BindingScope.SINGLETON})
export class CredentialService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @service(CredentialCommonService)
    private credCommonService: CredentialCommonService,
    @inject('services.OrganizationService')
    private orgService: OrganizationService,
    @inject('services.CredentialViewService')
    private credentialViewService: CredentialViewService,
    @inject('services.FlinstoneClient')
    private flinstoneClient: FlinstoneClient,
    @inject('config.credential') private credentialConfig: CredentialConfig,
    @inject('services.WalletClient')
    private walletClient: WalletClient,
    @inject('services.MonarchaClient')
    private monarchaClient: MonarchaClient,
    @inject(getServiceName(AWSService))
    private awsService: AWSService,
    @inject('services.PowerpuffClient') protected powerPuff: PowerpuffClient,
    @service(HolderCommonService)
    protected holderCommonService: HolderCommonService,
  ) {
    super(ctx);
  }

  @authAndAuthZ('create', 'Credential')
  async issueCredential({
    credentialContent,
    email,
    credentialTemplateId,
    sendEmail = false,
    sendPN = false,
    isWalletRegMandatory = false,
  }: IssueCredentialHolderInput) {
    const credentialTemplate =
      await this.flinstoneClient.getCredentialTemplateByID(
        credentialTemplateId,
      );

    const issuerOrg = await this.orgService.getIssuerOrg();

    const holder = await this.holderCommonService.getHolderFromWalletOrLocal({
      client_id: issuerOrg.did as string,
      emailordid: email,
      isWalletRegMandatory,
    });
    const holderCredentialInst = new HolderCredential(
      holder as HolderFromDIDOrEmail,
      this.walletClient,
      this.monarchaClient,
      this.credentialConfig,
      this.credentialViewService,
      this.powerPuff,
      this.credCommonService,
      credentialTemplate,
      this.awsService,
      issuerOrg,
      credentialContent,
    );
    await holderCredentialInst.issueCredential(sendEmail, sendPN);
    return 'Credential Issued';
  }
  @authAndAuthZ('update', 'Credential')
  async updateCredentialStatus({
    reason,
    status,
    tag,
  }: {
    tag: string;
    status: string;
    reason: string;
  }) {
    const ret = await this.monarchaClient.updateCredentialStatus({
      id: tag,
      status,
      reason,
      externalId: this.credentialConfig.externalId,
    });

    const claim = ret.credentialStatus?.verifiableCredential?.claim || {};
    return {
      ...claim,
      issued: ret.credentialStatus?.verifiableCredential?.issued,
    };
  }

  @authAndAuthZ('read', 'Credential')
  async getCredentialStatus({tag}: {tag: string}) {
    const ret = await this.monarchaClient.getCredentialStatus({
      id: tag,
    });

    const statusClaims = ret.credentialStatus?.verifiableCredential?.map(
      (x: any) => {
        return {...(x.claim || {}), issued: x.issued};
      },
    );
    return {statusClaims};
  }

  @authAndAuthZ('update', 'Credential')
  async initiateTranport({
    tag,
    sendEmail,
    sendPN,
    type,
  }: {
    tag: string;
    sendEmail?: boolean;
    sendPN?: boolean;
    type?: string;
  }) {}

  async verifyCredential({tag}: {tag: string}) {
    const ret = (await this.monarchaClient.verifyCredential({
      externalId: this.credentialConfig.externalId,
      id: tag,
    })) as VCredential;
    // get credential tranasaction data
    const credTranData = await CredTransaction.findOne({klefki_id: tag});
    const keyvals = await this.constructVCKeyVals({
      credentialSubject: ret?.credentialSubject,
      ele: ret,
      createdAt: credTranData?.createdAt,
    });
    return {keyvals};
  }

  async verifyCredentialExternalView({tag}: {tag: string}) {
    const ret = (await this.monarchaClient.verifyCredential({
      externalId: this.credentialConfig.externalId, //TODO
      id: tag,
    })) as VCredential;

    const holder = await this.holderCommonService.getHolderFromWalletOrLocal({
      client_id: ret.issuer?.id as string,
      emailordid: ret.credentialSubject?.alias as string,
    });

    const basekeyvals = await this.constructVCKeyVals({
      credentialSubject: ret?.credentialSubject,
      ele: ret,
      holder,
      // evidence
    });
    const credentialName = ret?.credentialSubject?.credentialName;
    // const newkeyvals =
    const data = await this.filterKeysByPersona({
      keyvals: basekeyvals,
      credentialName,
    });
    return {keyvals: data.keyvals};
    //TODO
  }

  private async filterKeysByPersona({
    keyvals,
    credentialName,
  }: {
    credentialName: string;
    keyvals: any[];
  }) {
    const role = await Role.findOne({name: 'Customer'}); //TODO replace static value
    if (!role) return {keyvals};
    if (role) {
      const permission = role.permissions.find(
        x => x.subject === credentialName,
      );
      if (!permission) return {keyvals};
      if (permission.fields?.includes('all')) return {keyvals};
      const filtered = keyvals.filter(x => permission.fields?.includes(x.key));
      return {keyvals: filtered};
    }

    return {keyvals: []};
  }

  @authenticateMethod
  async getVerifyCredentialView(tag: string) {}

  @authAndAuthZ('create', 'Credential')
  async transferCredentials({
    email,
    sendEmail = false,
    sendPN = false,
  }: Pick<IssueCredentialHolderInput, 'email' | 'sendEmail' | 'sendPN'>) {
    const issuerOrg = await this.orgService.getIssuerOrg();

    const holder = await this.walletClient.getUserProfile({
      did: issuerOrg.did as string,
      email,
    });

    const holderCredentialInst = new HolderCredential(
      holder as WalletUser,
      this.walletClient,
      this.monarchaClient,
      this.credentialConfig,
      this.credentialViewService,
      this.powerPuff,
      this.credCommonService,
      null,
      this.awsService,
      issuerOrg,
      [],
    );
    await holderCredentialInst.transferPendingCredentials(sendEmail, sendPN);
    return 'Transfer Initiated';
  }

  @authAndAuthZ('create', 'Credential')
  async sendEmailAndPN({
    tag,
    email,
    sendEmail = false,
    sendPN = false,
  }: InitiateTransportInput) {
    const issuerOrg = await this.orgService.getIssuerOrg();

    const holder = await this.holderCommonService.getHolderFromWalletOrLocal({
      client_id: issuerOrg.did as string,
      emailordid: email,
    });

    const getCredentialRes = await this.monarchaClient.getCredential({
      id: tag,
      externalId: this.credentialConfig.externalId,
    });
    const credentialTemplate =
      await this.flinstoneClient.getCredentialTemplateByName(
        getCredentialRes.verifiableCredential?.type[1],
        //'Mentor Certificate',
      );
    const transpInst = new TransportService(
      {
        tag,
        holder,
        issuerOrg: issuerOrg,
        sendPN: sendPN,
        sendEmail: sendEmail,
      },
      this.credentialConfig,
      this.walletClient,
      this.powerPuff,
    );

    if (sendEmail) {
      const ret = await this.credentialViewService.getEmail({
        holder,
        credential: getCredentialRes.verifiableCredential,
        credentialTemplate,
      });
      let pdf: string | undefined = undefined;
      if (credentialTemplate?.pdf_template) {
        const res = await this.credentialViewService.getPDF({
          holder,
          credential: getCredentialRes.verifiableCredential,
          credentialTemplate,
        });
        pdf = res?.pdf;
      }

      transpInst.addEmail({
        from: ret?.emailConfig?.from,
        cc: ret?.emailConfig?.cc,
        fileNameWithoutExt: 'credential',
        html: ret.emailHtml,
        pdf: pdf,
        subject: ret?.emailConfig?.subject,
      });
      transpInst.initiateTransportSync();
      return 'sending......';
    }
  }
  @authenticateMethod
  async getCredentialPreview(tag: string) {}

  @authenticateMethod
  async changeCredentialStatus({
    tag,
    reason,
    status,
  }: {
    tag: string;
    reason: string;
    status: CredentialStatus;
  }) {}

  // -----------------------------------priavte-----------------
  private getAdditionalKeys(key: string) {
    let label = '';
    let copyText = true;
    let link = null;
    let display = true;
    let type = '';

    // overwrite above values for specific key
    switch (key) {
      case 'name':
        label = '';
        copyText = false;
        link = null;
        display = false;
        type = 'string';
        break;
      case 'logo':
        label = '';
        copyText = false;
        link = null;
        display = false;
        type = 'string';
        break;
      case 'sameAs':
        label = '';
        copyText = false;
        link = null;
        display = false;
        type = 'string';
        break;
      case 'pk':
        label = 'Public Key';
        copyText = true;
        link = null;
        display = true;
        type = 'string';
        break;
      case 'id':
        label = 'DID';
        copyText = true;
        link = null;
        display = true;
        type = 'string';
        break;
      default:
        label = '';
        copyText = false;
        link = null;
        display = false;
        type = 'string';
    }
    return {
      label,
      copyText,
      link,
      display,
      type,
    };
  }
  private async constructVCKeyVals({
    credentialSubject,
    ele,
    holder,
    evidence,
    createdAt,
  }: {
    credentialSubject?: {[key: string]: string};
    ele: VCredential;
    holder?: WalletUser;
    evidence?: any;
    createdAt?: string;
  }) {
    ele.issuer.profile.id = ele?.issuer?.id;
    const issuerProfileArray = Object.entries(ele?.issuer?.profile ?? {});
    const credentialKeyVals = issuerProfileArray?.map(x => {
      const temp = x?.[1];
      const value =
        temp && (_.isDate(temp) || _.isString(temp) || _.isNumber(temp))
          ? temp
          : JSON.stringify(temp);
      const additionalKeys = this.getAdditionalKeys(x?.[0]);
      return {
        key: x?.[0],
        value: value,
        label: additionalKeys.label,
        copyText: additionalKeys.copyText,
        link: additionalKeys.link,
        display: additionalKeys.display,
        type: additionalKeys.type,
      };
    });

    if (ele?.issuanceDate)
      credentialKeyVals.push({
        key: 'validFrom',
        value: new Date(ele?.issuanceDate).toISOString(),
        label: 'Valid From',
        copyText: false,
        link: null,
        display: true,
        type: 'date',
      });
    if (ele?.expirationDate)
      credentialKeyVals.push({
        key: 'validUntil',
        value: new Date(ele?.expirationDate).toISOString(),
        label: 'Valid Until',
        copyText: false,
        link: null,
        display: true,
        type: 'date',
      });
    if (credentialSubject?.credentialName)
      credentialKeyVals.push({
        key: 'credentialName',
        value:
          credentialSubject?.credentialName === 'product'
            ? credentialSubject?.name
            : credentialSubject?.credentialName,
        label: 'Credential Name',
        copyText: false,
        link: null,
        display: false,
        type: 'string',
      });

    credentialKeyVals.push({
      key: 'status',
      value: 'Active',
      label: 'Status',
      copyText: false,
      link: null,
      display: true,
      type: 'string',
    });

    credentialKeyVals.push({
      key: 'digitallySignedBy',
      value: ele?.issuer?.profile?.name || '',
      label: 'Digitally Signed By',
      copyText: false,
      link: null,
      display: true,
      type: 'string',
    });
    credentialKeyVals.push({
      key: 'digitallySignedOn',
      value: createdAt ? moment.utc(createdAt).format() : '',
      label: 'Digitally Signed On',
      copyText: false,
      link: null,
      display: true,
      type: 'date',
    });

    return credentialKeyVals;
  }
}
