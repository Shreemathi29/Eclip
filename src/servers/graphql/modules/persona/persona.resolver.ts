import {PersonaCommonService} from '@/common/modules/persona/persona.common.service';
import {ISDRPersonaTx} from '@/common/modules/sdrPersonaTx/sdrPersona.model';
import {SDRPersonaTxCommonService} from '@/common/modules/sdrPersonaTx/sdrPersonaTx.service';
import {ITemplateStyle, TemplateStyle} from '@/common/modules/templateStyle';
import {getServiceName} from '@/utils/loopbackUtils';
import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {GqlCtx} from '../../graphql.component';

const allCredClaims = async (root: ISDRPersonaTx, args: any, ctx: GqlCtx) => {
  // console.log(root);
  if (!root.claims) return [];
  const credTemps = await TemplateStyle.find().lean(); //todo add more efficient code
  const claims = root.claims || [];
  // const credTempsInSdrtx = claims?.map(x => x.credentialTemplate?.toString());
  const ret = credTemps.map(credTemp => {
    const claimInPersona = claims.find(
      clm => clm.credentialTemplate?.toHexString() === credTemp._id.toString(),
    );
    if (claimInPersona) return {claim: claimInPersona, isTemplateEnabled: true};
    return {
      claim: {credentialTemplate: credTemp._id},
      isTemplateEnabled: false,
    };
  });

  // console.log(ret);
  return ret;
};

const credentialTemplate = async (root: any, args: any, ctx: GqlCtx) => {
  const actualCredTemp = root?.credentialTemplate;
  if (actualCredTemp && mongoose.isValidObjectId(actualCredTemp)) {
    return ctx.dataLoaders?.getTempStyleDataLoader()?.load(actualCredTemp);
  }
  return null;
};

const allKeys = async (
  root: ISDRPersonaTx['claims'][0],
  args: any,
  ctx: GqlCtx,
) => {
  // console.log(root);
  if (
    !root?.credentialTemplate ||
    !mongoose.isValidObjectId(root?.credentialTemplate)
  )
    return null;

  const credTemp = (await ctx.dataLoaders
    ?.getTempStyleDataLoader()
    ?.load(root?.credentialTemplate)) as ITemplateStyle;
  if (!credTemp)
    throw new HttpErrors.NotFound(
      `Allkeys: credentialTempalte not found for ${root.credentialTemplate}`,
    );
  // const formTempServ = ctx.reqCtx.getSync(
  //   'services.FormTemplateService',
  // ) as FormTemplateService;

  // const {fieldKeys} = await formTempServ.getFormKeys(credTemp.templateKey);
  const fieldKeys = credTemp.fields;
  const ret = fieldKeys.map(x => {
    if (root.allKeysEnabled)
      return {
        key: x,
        isEnabled: true,
      };
    return {
      key: x,
      isEnabled: (root.allowedKeys || []).includes(x),
    };
  });

  return ret;
};

const sdrPersonaTx = async (root: any, args: any, ctx: GqlCtx) => {
  // console.log(root);
  const val = root?.sdrPersonaTx;
  if (val && mongoose.isValidObjectId(val)) {
    return ctx.dataLoaders?.getsdrPersonDataLoader()?.load(val);
  }
  return null;
};

export const PersonaResolver = {
  Query: {
    async getPersonas(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(PersonaCommonService),
      ) as PersonaCommonService;
      return serv.getPersonas();
    },
  },

  Mutation: {
    async updateSDRPersonaTx(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(SDRPersonaTxCommonService),
      ) as SDRPersonaTxCommonService;
      return serv.updateSDRPersonaTx(args);
    },
    async createPersona(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(PersonaCommonService),
      ) as PersonaCommonService;
      return serv.createPersona(args);
    },
    async addUsersToPersona(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(PersonaCommonService),
      ) as PersonaCommonService;
      return serv.addUsersToPersona(args);
    },
    async removeUsersFromPersona(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(PersonaCommonService),
      ) as PersonaCommonService;
      return serv.removeUsersFromPersona(args);
    },
  },
  PersonaClaim: {
    allKeys,
    credentialTemplate,
    // allCredentials,
  },
  SDRPersonaTx: {
    allCredClaims,
  },
  Persona: {
    sdrPersonaTx,
  },
};
