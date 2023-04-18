import {CredentialConfig} from '../credential';
import {ICredTransaction} from '../credentialTransactions';
import {Fssai} from '../fssai/fssai.model';
import {IPersona} from '../persona/persona.model';
import {signatureStaticContent} from './signature';

export class StaticProvContentHelper {
  // todo fill the content here
  constructor(
    private queryInput: {
      masterGtin: string | undefined;
      allCredTxs: ICredTransaction[] | undefined;
      persona: IPersona;
      fssai: string | undefined;
      signatureMasterGtins: string[];
    },
    private VERIFY_CRDENTIAL_CONFIG: any,
    private credentialConfig: CredentialConfig,
  ) {}

  async get() {
    const staticProv = await this.isValidStaticProvContent();
    if (!staticProv) {
      return null;
    }
    const dynamicContent = await this.modifyDynamicContentForJSON();
    return dynamicContent;
  }

  async isValidStaticProvContent() {
    if (
      this.queryInput.signatureMasterGtins?.includes(
        this.queryInput?.masterGtin || '',
      ) &&
      this.queryInput?.persona?.name === 'Customer'
    )
      return true;
    return false;
  }

  async modifyDynamicContentForJSON() {
    const baseJSON = signatureStaticContent();
    const fssaiData = await Fssai.findOne({
      fssaiCode: this.queryInput.fssai,
    });
    // modify the baseJSON with dynamic content
    const updatedCredTranArr = baseJSON.provenances.map(prov => {
      if (prov?.ProvDetailInfo?.title === 'Signature Seal of Authenticity') {
        return prov;
      } else if (prov?.ProvDetailInfo?.title.includes('Our Master Blender')) {
        return prov;
      } else if (prov?.ProvDetailInfo?.title === 'Bottled At') {
        let provInfoList = [];
        provInfoList.push(getContentObj('Unit Name', fssaiData?.plantDesc));
        provInfoList.push(getContentObj('FSSAI', fssaiData?.fssaiCode));
        provInfoList.push(
          getContentObj('geoJSON', JSON.stringify(fssaiData?.geoJSON[0])),
        );
        prov.ProvDetailInfo.provInfoList = provInfoList;
        prov.provMapProps.geojson = fssaiData?.geoJSON[0];
        // assign credTxId and credentialURL url
        const credTranName = getCredTranName(prov?.ProvDetailInfo?.title);
        this.queryInput.allCredTxs?.map(credTran => {
          const credTranName = getCredTranName(prov?.ProvDetailInfo?.title);
          if (
            credTran?.credentialContent?.credentialSubject?.credentialName.toLocaleLowerCase() ===
            credTranName.toLocaleLowerCase()
          ) {
            // update dynamic credential transaction id
            prov.ProvStepTitle._id = credTran._id;
            prov.credTxId = credTran._id;
            // add credentialURL
            if (this.VERIFY_CRDENTIAL_CONFIG?.isEnabled) {
              prov.credentialURL =
                this.VERIFY_CRDENTIAL_CONFIG?.verifyWebAppUrl +
                '/' +
                this.credentialConfig.externalId +
                '/' +
                credTran?.klefki_id;
            }
          }
        });
        return prov;
      } else {
        let match = false;
        this.queryInput.allCredTxs?.map(credTran => {
          const credTranName = getCredTranName(prov?.ProvDetailInfo?.title);
          if (
            credTran?.credentialContent?.credentialSubject?.credentialName.toLocaleLowerCase() ===
            credTranName.toLocaleLowerCase()
          ) {
            // update dynamic credential transaction id
            prov.ProvStepTitle._id = credTran._id;
            prov.credTxId = credTran._id;
            // add credentialURL
            if (this.VERIFY_CRDENTIAL_CONFIG?.isEnabled) {
              prov.credentialURL =
                this.VERIFY_CRDENTIAL_CONFIG?.verifyWebAppUrl +
                '/' +
                this.credentialConfig.externalId +
                '/' +
                credTran?.klefki_id;
            }
            prov.ProvDetailInfo.provInfoList = getProvInfoListFromcredTran(
              credTran,
              credTranName,
            );
            prov.provMapProps.geojson = JSON.parse(
              credTran?.credentialContent?.credentialSubject?.geoJSON,
            );
            match = true;
          }
        });
        if (!match) {
          prov.ProvDetailInfo.provInfoList = [];
        }
      }
      return prov;
    });
    return {
      provenances: updatedCredTranArr,
    };
  }
}

function getContentObj(label: string, value: string | undefined) {
  return {
    label: label,
    value: value || 'NA',
  };
}

function getCredTranName(title: string) {
  let credTranName = '';
  switch (title) {
    case 'Ingredients from Best Farms':
      credTranName = 'sourceOfGrain';
      break;
    case 'Our Liquid Taste':
      credTranName = 'Blends';
      break;
    case 'Sealed With Care':
      credTranName = 'guala';
      break;
    case 'Bottled With Care':
      credTranName = 'bottles';
      break;
    case 'Labelled With Nature':
      credTranName = 'labels';
      break;
    default:
      credTranName = '';
  }
  return credTranName;
}

function getProvInfoListFromcredTran(
  credTran: ICredTransaction,
  credTranName: string,
) {
  let provInfoList = [];
  switch (credTranName) {
    case 'sourceOfGrain':
      provInfoList.push(
        getContentObj(
          'Source',
          credTran?.credentialContent?.credentialSubject?.source,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Source city',
          credTran?.credentialContent?.credentialSubject?.sourceCity,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Source Pin Code',
          credTran?.credentialContent?.credentialSubject?.sourcePostalCode,
        ),
      );
      provInfoList.push(
        getContentObj(
          'geoJSON',
          credTran?.credentialContent?.credentialSubject?.geoJSON,
        ),
      );
      break;
    case 'guala':
      provInfoList.push(
        getContentObj(
          'Source',
          credTran?.credentialContent?.credentialSubject?.source,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Source city',
          credTran?.credentialContent?.credentialSubject?.sourceCity,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Source Pin Code',
          credTran?.credentialContent?.credentialSubject?.sourcePostalCode,
        ),
      );
      provInfoList.push(
        getContentObj(
          'geoJSON',
          credTran?.credentialContent?.credentialSubject?.geoJSON,
        ),
      );
      break;
    case 'Blends':
      provInfoList.push(
        getContentObj(
          'Batchno',
          credTran?.credentialContent?.credentialSubject?.batchNo,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Mfgdate',
          credTran?.credentialContent?.credentialSubject?.mfgDate,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Sensory',
          credTran?.credentialContent?.credentialSubject?.sensory,
        ),
      );
      provInfoList.push(
        getContentObj(
          'geoJSON',
          credTran?.credentialContent?.credentialSubject?.geoJSON,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Percent Vol.',
          credTran?.credentialContent?.credentialSubject?.perctVolPerVol,
        ),
      );
      break;
    case 'bottles':
      provInfoList.push(
        getContentObj(
          'Source',
          credTran?.credentialContent?.credentialSubject?.source,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Source city',
          credTran?.credentialContent?.credentialSubject?.sourceCity,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Source Pin Code',
          credTran?.credentialContent?.credentialSubject?.sourcePostalCode,
        ),
      );
      provInfoList.push(
        getContentObj(
          'geoJSON',
          credTran?.credentialContent?.credentialSubject?.geoJSON,
        ),
      );
      break;
    case 'labels':
      provInfoList.push(
        getContentObj(
          'Source',
          credTran?.credentialContent?.credentialSubject?.source,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Source city',
          credTran?.credentialContent?.credentialSubject?.sourceCity,
        ),
      );
      provInfoList.push(
        getContentObj(
          'Source Pin Code',
          credTran?.credentialContent?.credentialSubject?.sourcePostalCode,
        ),
      );
      provInfoList.push(
        getContentObj(
          'geoJSON',
          credTran?.credentialContent?.credentialSubject?.geoJSON,
        ),
      );
      break;
    default:
      provInfoList = [];
  }
  return provInfoList;
}
