/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {log} from '@/utils';
import {bind, BindingScope, Context, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SDRPersonaTxCommonService} from '../sdrPersonaTx/sdrPersonaTx.service';
import {Persona} from './persona.model';

export interface FullProvInputArgs {
  barcode?: string;
  nfcHash?: string;
  // latitude?: number;
  // longitude?: number;
  // network?: string;
  appMode: 'mobile' | 'web';
  gs1Data?: {batchNo?: string; gtin?: string; serialNo?: string};
  user?: {email?: string; name?: string};
  ip?: string;
  location?: {
    geoCoordinates: {type: string; coordinates: number[]};
    city: string | undefined;
    region: string | undefined;
    country: string | undefined;
  };
  symbology?: string;
  isTampered?: boolean;
  tapCount?: number;
  isTamperTag?: boolean;
}

@bind({scope: BindingScope.SINGLETON})
export class PersonaCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.SDRPersonaTxCommonService')
    private sdrPersonaTxCommonService: SDRPersonaTxCommonService,
  ) {
    super(ctx);
  }

  @authAndAuthZ('read', 'Persona')
  async getPersonas() {
    log.debug(`getPersonas (many) init==> , `);

    const personas = await Persona.find({});

    log.debug(`getPersonas (many) finish==>  , `);

    return personas;
  }

  @authAndAuthZ('create', 'Persona')
  async createPersona(reqData: any) {
    log.debug(`createPersonas init==> , `);
    // check if persona already exists
    const findPersona = await Persona.findOne({name: reqData.name});
    if (findPersona) {
      throw new HttpErrors.BadRequest(
        `Persona with name ${reqData.name} already exists`,
      );
    }
    // first create sdrPersona
    const sdrPersonaTx =
      await this.sdrPersonaTxCommonService.createSDRPersonaTx();
    // create persona
    reqData.sdr = sdrPersonaTx.sdr;
    reqData.sdrPersonaTx = sdrPersonaTx._id;
    const persona = await Persona.create(reqData);
    log.debug(`createPersonas finish==>  , `);
    return persona;
  }

  @authAndAuthZ('update', 'Persona')
  async addUsersToPersona(reqData: any) {
    log.debug(`addUsersToPersona init==> , `);
    // compare existing and new persona users and prepare unique list
    const existingPersona = await Persona.findOne({_id: reqData.personaId});
    if (!existingPersona) {
      throw new HttpErrors.NotFound(
        `Persona with id ${reqData.personaId} not found`,
      );
    }
    // check of users are duplicate across the persona throw error
    const emailArr = reqData.users.map((user: {email: any}) => user.email);
    const duplicateUsers = await Persona.find({
      users: {
        $elemMatch: {
          email: emailArr,
        },
      },
    });
    if (duplicateUsers.length > 0) {
      throw new HttpErrors.BadRequest(
        `User already exists for persona team ${existingPersona?.name}`,
      );
    }

    let existingUsers = existingPersona?.users ?? [];
    if (existingUsers.length === 0) existingUsers = reqData.users;
    const uniqueUsers = this.getUnique(existingUsers, reqData.users);

    // update persona
    const updatedPersona = await Persona.findOneAndUpdate(
      {_id: reqData.personaId},
      {users: uniqueUsers},
      {new: true},
    );
    log.debug(`addUsersToPersona finish==>  , `);
    return updatedPersona;
  }

  @authAndAuthZ('update', 'Persona')
  async removeUsersFromPersona(reqData: any) {
    log.debug(`removeUsersFromPersona init==> , `);
    // compare existing and new persona users and prepare unique list
    const existingPersona = await Persona.findOne({_id: reqData.personaId});
    if (!existingPersona) {
      throw new HttpErrors.NotFound(
        `Persona with id ${reqData.personaId} not found`,
      );
    }
    if (existingPersona?.users?.length === 0) {
      return existingPersona;
    }
    // update persona
    const updatedPersona = await Persona.updateOne(
      {_id: reqData.personaId},
      {$pullAll: {users: reqData.users}},
    );
    log.debug(`removeUsersFromPersona finish==>  , `);
    return updatedPersona;
  }

  getUnique = (arr1: any, arr2: any): {email: string; name?: string}[] =>
    Object.values(
      [...arr1, ...arr2].reduce((result, obj) => {
        const key = `${obj.email}`;
        result[key] ??= {name: obj.name, email: obj.email};
        return result;
      }, {}),
    );
}
