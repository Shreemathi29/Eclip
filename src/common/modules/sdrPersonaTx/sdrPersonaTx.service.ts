import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {FormTemplateService} from '@/common/services/formTemplateService';
import {log} from '@/utils';
import {bind, BindingScope, Context, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {mongo} from 'mongoose';
import {TemplateStyle} from '../templateStyle';
import {SDRPersonaTx} from './sdrPersona.model';

@bind({scope: BindingScope.SINGLETON})
export class SDRPersonaTxCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.FormTemplateService')
    private formTemplateService: FormTemplateService,
  ) {
    super(ctx);
  }

  @authAndAuthZ('create', 'Persona')
  async createSDRPersonaTx() {
    const sdrPersonaTx = await SDRPersonaTx.create({
      sdr: new mongo.ObjectID(),
      claims: [],
    });
    return sdrPersonaTx;
  }

  @authAndAuthZ('manage', 'Persona')
  async updateSDRPersonaTx({
    data,
    sdrPersonatxId,
  }: {
    sdrPersonatxId: string;
    data: {
      removeCredTempIds: string[];
      upserts: {
        credTempId: string;
        allKeysEnabled?: boolean;
        allowedKeys: string[];
      }[];
    };
  }) {
    log.debug(`updateSDRPersonaTx init ==> sdrPersonatxId: ${sdrPersonatxId}`);

    const sdrPersonaTx = await SDRPersonaTx.findOne({_id: sdrPersonatxId});
    if (!sdrPersonaTx)
      throw new HttpErrors.NotFound(
        `sdrPersonaTx not found for id: ${sdrPersonatxId}`,
      );
    const upserts = data.upserts || [];
    const credTempIds = upserts.map(x => x.credTempId);
    const tempStyles = await TemplateStyle.find({_id: {$in: credTempIds}});
    const upsertsWithCredTemps = upserts.map(x => {
      const credTemp = tempStyles.find(y => y._id.toString() === x.credTempId);
      if (!credTemp)
        throw new HttpErrors.NotFound(
          `CredentialTemplate not found for id: ${x.credTempId}`,
        );
      return {...x, credTemp};
    });
    //  --------------------------------------------------------------------
    const newClaimsPromises = upsertsWithCredTemps.map(async val => {
      if (val.allKeysEnabled) return val;
      else {
        // const ret = await this.formTemplateService.getFormKeys(
        //   val.credTemp.templateKey,
        // );
        val.allowedKeys.forEach(key => {
          if (!val.credTemp?.fields?.includes(key))
            throw new HttpErrors.BadRequest(
              `The key: ${key} is not allowed in template Id:${val.credTemp._id} ,name:${val.credTemp.name}`,
            );
        });
        return val;
      }
    });
    const newClaims = await Promise.all(newClaimsPromises);

    // -----------------------------------------------------
    let claims = sdrPersonaTx.claims;

    claims = claims.filter(
      x => !data.removeCredTempIds?.includes(x.credentialTemplate?.toString()),
    );

    newClaims.forEach(clm => {
      const index = claims.findIndex(
        x => x.credentialTemplate.toString() === clm.credTemp._id.toString(),
      );
      const temp = {
        allKeysEnabled: clm.allKeysEnabled || false,
        credentialTemplate: clm.credTemp._id,
        allowedKeys: clm.allowedKeys,
      };
      if (index > 0) claims.splice(index, index, temp);
      else {
        claims.push(temp);
      }
    });
    const newSdrPersonaTx = await SDRPersonaTx.findOneAndUpdate(
      {_id: sdrPersonaTx},
      {$set: {claims}},
      {new: true},
    );
    log.debug(`updateSDRPersonaTx finish ==> `);
    return newSdrPersonaTx;
    // --------------------------------------------------------
  }
}
