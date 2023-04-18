import {MonarchaClient, VCredential} from '@/clients/rest/monarcha.client';
import {EnvModule, log} from '@/utils';
import {convertToFullAddress} from '@/utils/constants';
import {bind, BindingScope} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  Brand,
  IBrand,
  IOrgType
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {
  IItem,
  Item
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {
  IVariant,
  Variant
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import _ from 'lodash';
import {CredentialConfig} from '../credential';
import {CredTransaction, ICredTransaction} from '../credentialTransactions';
import {IPersona, Persona} from '../persona/persona.model';
import {ISDRPersonaTx, SDRPersonaTx} from '../sdrPersonaTx/sdrPersona.model';
const env = EnvModule?.getInstance()?.getEnv();

@bind({scope: BindingScope.SINGLETON})
export class VerifyItemCredHelper {
  private variant: IVariant;
  private item: IItem;
  private org: IBrand;
  private credTx?: ICredTransaction | null;
  private credSub?: {[key: string]: string | string[]};
  private evidence?: any | null;
  private decodedCred: VCredential;
  private sdrPersonaTx: ISDRPersonaTx;
  private persona: IPersona;
  constructor(
    private queryInput: {gtin: string; userProfile?: any},
    private monarchaClient: MonarchaClient,
    private credentialConfig: CredentialConfig,
  ) { }

  public async get() {
    // todo remove static data
    await this.getPersona();
    await this.getFromDB();
    await this.getDecodedCred();
    // this.filterKeys();
    const response: any = {
      data: {
        productDetails: this.getProductDetails(),
      },
    };
    if (env?.VERIFY_CRDENTIAL_CONFIG?.isEnabled) {
      response.data.credentialURL =
        env?.VERIFY_CRDENTIAL_CONFIG?.verifyWebAppUrl +
        '/' +
        this.credentialConfig.externalId +
        '/' +
        this.credTx?.klefki_id;
    }
    return response;
  }

  private async getFromDB() {
    const variant = await Variant.findOne({gtinKey: this.queryInput?.gtin});
    if (!variant)
      throw new HttpErrors.NotFound(
        `variant not found: ${this.queryInput?.gtin}`,
      );

    // ----------------------------------------------------------------------
    const item = await Item.findOne({_id: variant.item});
    if (!item)
      throw new HttpErrors.NotFound(`product not found: ${variant.item}`);
    this.item = item;
    // // ------------------------------------------------------------------
    const org = await Brand.findOne({orgType: IOrgType.NETWORK});
    if (!org) throw new HttpErrors.NotFound(` network org not found}`);

    if (!variant.klefki_id) {
      log.error(
        `get product cred => klefki_id not found for gtin ${variant.gtinKey}`,
      );
      throw new HttpErrors.InternalServerError('Internal server Error ');
    }

    // ------------------------------------------------------------------
    const credTx = await CredTransaction.findOne({
      klefki_id: variant.klefki_id,
    });

    if (!credTx)
      throw new HttpErrors.NotFound(
        `credTx for klefki_id: ${variant.klefki_id} not found`,
      );

    this.credTx = credTx;
    // -----------------------------------------------------
    // ----------------------------------------------------
    this.variant = variant;
    this.org = org;
    // ---------------------------------------------------------------------
  }

  private async getDecodedCred() {
    try {
      const decodedCred = (await this.monarchaClient.verifyCredential({
        externalId: this.credentialConfig.externalId,
        id: this.credTx?.klefki_id as string,
      })) as VCredential;

      this.decodedCred = decodedCred;
      this.credSub = decodedCred?.credentialSubject;
      this.evidence = decodedCred?.evidence;
    } catch (err) {
      log.warn(
        `unable to verify gtin credential switching to db. klefkiid: ${this.variant.klefki_id}. gtin: ${this.variant.gtinKey}`,
      );
      this.decodedCred = {
        credentialSubject: this.credTx?.credentialContent.credentialSubject,
      } as any;
      this.credSub = this.credTx?.credentialContent.credentialSubject;
      this.evidence = this.credTx?.credentialContent.evidences;
    }
  }

  private rmEmptyValues(arr: {label?: string; value?: string; key?: string}[]) {
    return arr.filter(x => !_.isNil(x.value));
  }

  private getProductDetails() {
    const extraInfo = [];
    // this.rmEmptyValues([
    // 	{
    // 		label: 'GTIN',
    // 		value: this.gtin.gtinKey,
    // 	},

    // 	{
    // 		label: 'Price',
    // 		value: this.gtin.price,
    // 	},
    // 	{
    // 		label: this.getQtyFormatted(this.gtin.quantityMetric),
    // 		value: this.gtin.quantity,
    // 	},
    // 	{
    // 		label: 'From',
    // 		value: this.gtin.address,
    // 	},
    // ]);
    const credSub = this.decodedCred?.credentialSubject || {};
    const keyVals = Object.entries(credSub)
      .map(x => {
        return {key: x[0], label: _.capitalize(x[0]), value: x[1]};
      })
      .filter(x => x.key !== 'description')
      .filter(x => x.key !== 'logo')
      .filter(x => x.key !== 'credentialName')
      .filter(x => x.key !== 'id')
      .filter(x => x.key !== 'alias')
      .filter(x => x.key !== 'name')
      .filter(x => x.key !== 'credentialLogo');
    const logos = Array.isArray(this.credTx?.credentialContent?.images)
      ? [this.credTx?.credentialContent?.images]
      : this.credTx?.credentialContent?.images;

    const images = logos?.map((x: any) => ({image: x}));
    return {
      ProductDetailTitle: {
        title: 'Product Details',
      },
      ProductImages: {
        productImages: this.item?.assets?.imgs || [],
      },
      ProductTitleCard: {
        title: _.capitalize(credSub?.name),
        logo: this.org.logo,
        extraInfo: this.rmEmptyValues([
          {
            label: 'GTIN',
            value: credSub?.gtin,
          },

          {
            label: 'Price',
            value: credSub?.price,
          },
          {
            label: _.capitalize(credSub?.quantityMetric || ''),
            value: credSub?.quantity,
          },
          {
            label: 'From',
            value: credSub?.from,
          },
        ]),
      },
      ProductDetailInfo: {
        title: 'About ' + _.capitalize(credSub?.name),
        aboutProdInfo: this.item?.desc ? this.item?.desc[0].val : '',
        productInfoList: this.rmEmptyValues(keyVals),
      },

      OrganizationInfo: {
        title: 'About Organization',
        aboutOrgInfo: this.org.description,
        organizationInfoList: this.rmEmptyValues([
          {
            label: 'Website',
            value: this.org.sameAs,
          },
          {
            label: 'Email',
            value: this.org.email,
          },
          {
            label: 'Contact',
            value: this.org.telephone,
          },
          {
            label: 'Address',
            value: this.org?.address
              ? convertToFullAddress(this.org?.address)
              : '',
          },
          // {
          // 	label: 'DRINKiQ',
          // 	value: 'https://www.drinkiq.com/en-in',
          // },
        ]),
        socialLinks: this.org.socialLinks,
      },
    };
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
    // return {persona, sdrPersonaTx};
    this.sdrPersonaTx = sdrPersonaTx;
    this.persona = persona;
  }

  // private filterKeys() {
  //   // const sdrPersonaCredTemps = this.sdrPersonaTx.claims?.map(x =>
  //   // 	x.credentialTemplate?.toHexString(),
  //   // );
  //   const email = this.queryInput?.userProfile?.user?.email;
  //   const credTemp = this.sdrPersonaTx.claims?.find(
  //     x =>
  //       x.credentialTemplate?.toString() ===
  //       this.credTx?.credentialTemplate?.toString(),
  //   );
  //   if (!credTemp)
  //     throw new HttpErrors.Forbidden(
  //       `not authorized to view credential ${this.credTx?.credentialTemplate} email: ${email}`,
  //     );

  //   if (credTemp.allKeysEnabled) {
  //     // temp = this.credSub
  //   } else {
  //     const temp = _.pick(this.credSub, [
  //       'credentialName',
  //       'description',
  //       'logo',
  //       ...(credTemp?.allowedKeys || []),
  //     ]);
  //     const newCredSub = _.pickBy(temp, _.identity);
  //     this.credSub = (newCredSub as {[key: string]: string | string[]}) || {};
  //     if (!credTemp?.allowedKeys?.includes('evidence')) this.evidence = null;
  //   }
  // }
}
