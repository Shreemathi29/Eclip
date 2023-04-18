/*



 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
// import {MonarchaClient, VCredential} from '@/clients/rest/monarcha.client';
import {CredentialTemplate} from '@/clients/rest/flinstone.client';
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {VCredential} from '@clients/rest/monarcha.client';
import {bind, BindingScope, inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {IEntity} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/entity/entity.model';
import {AssetCatalogueModuleService} from '@vlinder-be/asset-catalogue-module/dist/module/services/module.service';
import moment from 'moment';
import momgoose from 'mongoose';
import {v4} from 'uuid';
import {Context} from 'vm';
export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  DISPUTED = 'disputed',
  TRANSFERRED = 'transferred',
}
export enum CredentialType {
  VERIFIABLE_CREDENTIAL = 'VerifiableCredential',
  VPR = 'VPR',
  VERIFIABLE_PRESENTATION = 'VerifiablePresentation',
}

export enum CredentialState {
  CREATED = 'created',
  SIGNED = 'signed',
  ANCHORED = 'anchored',
}
export enum CredentialAuthorizeState {
  NONE = 'none',
  NOP = 'nop',
}
export enum CredentialStorageStatus {
  SENT = 'sent',
  STORED_IN_WALLET = 'storedInWallet',
  HOLDER_DECLINED = 'holderDeclined',
}

export enum ConsentMethod {
  IRIS = 'iris',
  FACE = 'face',
  FINGERPRINT = 'fingerprint',
  MOBILE = 'mobile',
}

export interface ICredentialSubject {
  key: string;
  value: string | string[];
}

export interface CredentialConfig {
  externalId: string;
  storeURL: string;
  evidenceBucket: string;
  ownBaseURL: string;
  evidenceRoute: string;
  statusURL: string;
}

@bind({scope: BindingScope.SINGLETON})
export class CredentialCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @service(AssetCatalogueModuleService)
    private assetCatalogueService: AssetCatalogueModuleService,
    @service(MonarchaClient)
    protected monarchaClient: MonarchaClient,
  ) {
    super(ctx);
  }

  @authAndAuthZ('read', 'Credential')
  async getCredential(tag: string) {
    const credential =
      await this.assetCatalogueService.serializedEntity.findOne({});
    if (!credential)
      throw new HttpErrors[404](`credential not found tag:${tag}`);
    return credential;
  }

  @authAndAuthZ('create', 'Credential')
  async createCredential(
    credential: VCredential,
    template: CredentialTemplate,
  ) {
    const entity = this.credentialToEntity(credential, template);
    const cred = await this.assetCatalogueService.serializedEntity.create(
      entity,
    );
    return cred;
  }

  // ------private --------------------------------
  private credentialToEntity(
    credential: VCredential,
    template: CredentialTemplate,
  ) {
    const dates: any[] = [];
    dates.push({
      name: 'Issuance Date',
      val: moment(credential.issuanceDate).toDate(),
    });
    if (credential.expirationDate) {
      dates.push({
        name: 'Expiration Date',
        val: moment(credential.expirationDate).toDate(),
      });
    }
    const placeholderId = v4();
    const tag = credential.id?.split('/').pop();
    const entity: any = {
      name: credential.credentialSubject?.credentialName,
      lname: credential.credentialSubject?.credentialName?.toLowerCase(),
      desc: [
        {
          lang: 'en',
          val: template.description,
        },
      ],
      assets: {
        imgs: [
          {
            height: '100',
            src: template.logo as string,
            width: '100',
            asset_type: 'url',
          },
        ],
        others: [],
      },

      attrs: this.KeyValue(credential.credentialSubject),
      date_attrs: dates,
      // external_id: null, //TODO add appropriate keys
      // vln_cid: null,
      klefki_id: tag,
      to: credential.credentialSubject.id,
      from: credential.issuer.id,
      variant: momgoose.Types.ObjectId('60198a84d85ef34864d4b421'),
      token_group: momgoose.Types.ObjectId('60198a84d85ef34864d4b421'), //TODO
      token_id: '1',
    };

    return entity;
  }

  private entityToCredential(entity: IEntity) {}

  private KeyValue(object: any) {
    const attr: {
      name: string;
      val: string;
    }[] = [];

    for (const [key, value] of Object.entries(object)) {
      attr.push({name: key, val: value as string});
    }
    return attr;
  }
}
