/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {EnvModule, log, pretty} from '@/utils';
import {HttpErrors} from '@loopback/rest';
import {
  Brand,
  IOrgType,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {
  IItem,
  Item,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {
  IVariant,
  Variant,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import {
  CredTransaction,
  ICredTransaction,
} from '../credentialTransactions/credentialTransaction.model';
import {IPersona, Persona} from '../persona/persona.model';
import {
  IPersonaAltFieldMap,
  PersonaAltFieldMap,
} from '../personaAltFieldMap/personaAltFieldMap.model';
import {ISDRPersonaTx, SDRPersonaTx} from '../sdrPersonaTx/sdrPersona.model';
import {
  ITemplateStyle,
  TemplateStyle,
} from '../templateStyle/templateStyle.model';
const env = EnvModule?.getInstance()?.getEnv();

export class GetProvCredGlobalHelper {
  private credTxs?: ICredTransaction[] | null;
  private sdrPersonaTx: ISDRPersonaTx;
  private persona: IPersona;
  private org: any;
  private personaFieldMapping: IPersonaAltFieldMap | null;
  private item: IItem | null;
  private variant: IVariant | null;
  private credTemplates: ITemplateStyle[] | null;
  private defaultCredTemplate: ITemplateStyle | null;
  constructor(
    private queryInput: {
      gtin: string;
      credTxIds: string;
      userProfile?: any;
    },
  ) {}

  public async get() {
    log.info(`get Prov ==> ${pretty(this.queryInput)}`);
    //  -----------------------------------------------------------------------
    await this.getFromDB();
    await this.getOrg();
    await this.getPersona();
    await this.getAltFieldMappingDocument();
    await this.loadCredTemplates();
    //  ---------------------------------------------------------------------------
    const response: any = {
      persona: this.persona,
      credTxs: this.credTxs,
      sdrPersonaTx: this.sdrPersonaTx,
      variant: this.variant,
      item: this.item,
      personaFieldMapping: this.personaFieldMapping,
      credTemplates: this.credTemplates,
      defaultCredTemplate: this.defaultCredTemplate,
      org: this.org,
    };
    return response;
  }

  private async getOrg() {
    this.org = await Brand.findOne({orgType: IOrgType.NETWORK});
  }

  private async loadCredTemplates() {
    // load credential templates in memory
    this.credTemplates = await TemplateStyle.find();
    // default - load others
    this.defaultCredTemplate = await TemplateStyle.findOne({name: 'Others'});
  }

  private async getFromDB() {
    // ---------------------------------------------------------------------
    const credTxs = await CredTransaction.find({
      _id: {
        $in: this.queryInput?.credTxIds,
      },
    });
    this.credTxs = credTxs;
  }

  async getPersona() {
    const email = this.queryInput?.userProfile?.user?.email;
    let persona: IPersona | null = null;
    if (email) {
      persona = await Persona.findOne({'users.email': email});
    }
    if (!persona) {
      persona = await Persona.findOne({name: 'Customer'});
    }
    if (!persona)
      throw new HttpErrors.NotFound(`no persona found email: ${email}`);
    const sdrPersonaTx = await SDRPersonaTx.findOne({
      _id: persona.sdrPersonaTx,
    });
    if (!sdrPersonaTx)
      throw new HttpErrors.NotFound(
        `sdrPersonaTx not found  for email: ${email}`,
      );
    this.sdrPersonaTx = sdrPersonaTx;
    this.persona = persona;
  }

  async getAltFieldMappingDocument() {
    const variant = await Variant.findOne({gtinKey: this.queryInput?.gtin});
    if (!variant)
      throw new HttpErrors.NotFound(
        `variant not found: gtinKey : ${this.queryInput?.gtin}`,
      );
    this.variant = variant;
    // ----------------------------------------------------------------------
    const item = await Item.findOne({_id: variant.item});
    if (!item) throw new HttpErrors.NotFound(`item not found: ${variant.item}`);
    this.item = item;
    let personaFieldMapping: IPersonaAltFieldMap | null = null;
    if (this.persona._id) {
      personaFieldMapping = await PersonaAltFieldMap.findOne({
        persona: this.persona._id,
        items: this.item?._id,
      });
    }
    this.personaFieldMapping = personaFieldMapping;
  }
}
