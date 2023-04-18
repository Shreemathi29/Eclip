/* eslint-disable @typescript-eslint/camelcase */
/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import {
  CreateCredentialRequest,
  GetCredential,
  MonarchaClient,
  VCredential,
} from '@/clients/rest/monarcha.client';
import {WalletClient} from '@/clients/rest/wallet.client';
import {clientAuth} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {
  IAccessTokenInput,
  IAccessTokenOutput,
} from '@/servers/rest/client-controllers/common/common.client.openapi';
import {
  FindCredentialRes,
  ICreateCredential,
  ICredentialRequest,
  ICredentialsRequest,
} from '@/servers/rest/client-controllers/issuer/credential/credential.client.openapi';
import {
  FindHolders,
  GetHolder,
  IHolderRequest,
  IHoldersRequest,
} from '@/servers/rest/client-controllers/issuer/holder/holder.client.openapi';
import {constants} from '@/utils/constants';
import {bind, BindingScope, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Context} from 'vm';
import {CredentialConfig} from '../common/modules/credential/credential-common.service';
import {Holder} from '../common/modules/holder/holder.model';

@bind({scope: BindingScope.SINGLETON})
export class ClientService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.WalletClient')
    private walletServ: WalletClient,
    @inject('services.MonarchaClient')
    private monarchaServ: MonarchaClient,
    @inject('config.credential') private credentialConfig: CredentialConfig,
  ) {
    super(ctx);
  }

  async getHolder(reqData: IHolderRequest): Promise<GetHolder> {
    const data = await Holder.findOne({email: reqData.email});
    if (!data) {
      throw new HttpErrors.NotFound(constants.MESSAGES.HOLDER_NOT_FOUND);
    }

    // connect with wallet core app for getting did, wallet_registered
    let walletRes = null;
    let did = null;
    let wallet_registered = false;
    try {
      walletRes = await this.walletServ.getUsersByEmailOrDID({
        entries: [reqData.email],
        client_id: reqData.client_id,
      });
      // update did and wallet_registered, If wallet response is positive
      did = walletRes[0].wallet.did;
      wallet_registered = walletRes[0].isRegistered;
    } catch (err) {
      console.log(err);
    }

    const res = {
      holder: {
        email: data.email,
        given_name: data.givenName,
        family_name: data.familyName,
        wallet_registered: wallet_registered,
        did: did,
      },
    };

    return res;
  }

  @clientAuth
  async findHolders(reqData: IHoldersRequest): Promise<FindHolders> {
    const perPage = reqData.pageSize || 10;
    const page = Math.max(1, reqData.currentPage);

    const data = await Holder.aggregate([
      {
        $facet: {
          totalData: [
            {$match: {}},
            {$sort: {updatedAt: -1}},
            {$skip: perPage * (page - 1)},
            {$limit: perPage},
          ],
          totalCount: [
            {
              $group: {
                _id: null,
                count: {$sum: 1},
              },
            },
          ],
        },
      },
    ]);
    if (data[0].totalData.length === 0) {
      throw new HttpErrors.NotFound(constants.MESSAGES.HOLDERS_NOT_FOUND);
    }
    const emailArray: string[] = [];
    // firstly assign keys with null and false value for did and wallet_registered for all holders.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let holdersArray = data[0].totalData.map((holder: any) => {
      holder.did = null;
      holder.wallet_registered = false;
      emailArray.push(holder.email);
    });
    let walletRes: any = null;
    try {
      walletRes = await this.walletServ.getUsersByEmailOrDID({
        entries: emailArray,
        client_id: reqData.client_id,
      });
      // then update did and wallet_registered, If wallet response is positive
      if (walletRes) {
        holdersArray = data[0].totalData.map((holder: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const walletArray = walletRes?.map((walletObj: any) => {
            if (holder.email === walletObj.email) {
              holder.did = walletObj?.wallet?.did || null;
              holder.wallet_registered = walletObj?.isRegistered || false;
            }
          });
        });
      }
    } catch (err) {
      console.log(err);
    }

    const res = {
      holders: data[0].totalData,
      pagination: {
        currentPage: page,
        pageSize: perPage,
        totalCount: data[0].totalCount[0].count,
        totalPages: Math.ceil(data[0].totalCount[0].count / perPage),
      },
    };
    return res;
  }

  async createCredential(reqData: ICreateCredential): Promise<VCredential> {
    // call monarcha service and pass data there
    const credentialData: CreateCredentialRequest = {
      issuanceDate: reqData.issuance_date,
      expirationDate: reqData.expiration_date,
      credentialSubject: reqData.credential_subject,
      evidence: reqData.evidence,
      credentialName: reqData.credential_name,
      credentialTemplate: reqData.credential_template,
      credentialLogo: reqData.credential_logo,
      credentialTag: reqData.credential_tag,
      externalId: reqData.externalId,
      issuer: reqData.issuer,
    };
    const credentialRes = await this.monarchaServ.createCredential(
      credentialData,
    );
    return credentialRes;
  }

  async getCredential(reqData: ICredentialRequest): Promise<GetCredential> {
    const data = await this.monarchaServ.getCredential({
      id: reqData.tag,
      externalId: this.credentialConfig.externalId,
    });
    return data;
  }

  async getAccessToken(
    reqData: IAccessTokenInput,
  ): Promise<IAccessTokenOutput> {
    if (!reqData.client_id || !reqData.secret) {
      throw new HttpErrors.NotFound(
        constants.MESSAGES.ACCESS_TOEKN_DATA_NOT_FOUND,
      );
    }
    // add token expiration
    reqData.exp = '30 days';
    const data = await this.monarchaServ.getAccessToken(reqData);
    return data;
  }

  async findCredentials(
    reqData: ICredentialsRequest,
  ): Promise<FindCredentialRes> {
    // TODO: pagination not porperly responding data
    const data = await this.monarchaServ.findCredential({
      where: [],
      take: reqData.pageSize > 0 ? reqData.pageSize : 10,
      skip: reqData.currentPage > 0 ? reqData.currentPage : 1,
    });
    const pagination = {
      currentPage: data.currentPage,
      pageSize: data.pageSize,
      totalCount: data.totalCount,
      totalPages: data.totalPages,
    };
    return {
      credentials: data.credentials,
      pagination: pagination,
    };
  }
}
