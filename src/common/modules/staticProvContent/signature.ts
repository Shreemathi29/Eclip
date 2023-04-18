// Signature Data for Mapping :
// Signature Seal of Authenticity --> Complete static data  ( description ). No dynamic content.
// Our Master Blender - Louis Marting --> Complete static data  ( description ) . No dynamic content.
// Ingredients from Best Farms --> Static Data ( description ).. Dynamic is map… Connects to SAP Credential "sourceOfGrain" ( if available )..  Should show keys "Source", "Source city", "Source Pin Code" and "geoJSON"
// Our Liquid Taste --> Static Data ( Description ).. Connects to SAP Credential "Blends".. Should show keys "batchNo", "mfgDate", "sensory", "perctVolPerVol", "geoJSON".
// Sealed with Care --> Static Data ( Description ) .. Connects to SAP Credential "guala". Should show keys  "Source", "Source city", "Source Pin Code" and "geoJSON".
// Bottled with Care --> Static Data ( Description ).. Connects to SAP Credential "bottles". Should show keys  "Source", "Source city", "Source Pin Code" and "geoJSON".
// Bottled At --> Dynamic Data ( we have to build a look up of Plant Code -> geoJSON of factories ). Lets discuss in meeting.
// Labelled with Nature --> Static Data ( Description ).. Connects to SAP Credential "labels". Should show keys  "Source", "Source city", "Source Pin Code" and "geoJSON".

export function signatureStaticContent() {
  return {
    provenances: [
      {
        id: 1,
        key: 'capclick',
        persona: {
          personaName: '',
          sdrPersonaTx: '',
          altFieldMap: {
            mappedCount: 1,
            isAltmapFound: true,
          },
        },
        ProvStepTitle: {
          title: '',
          _id: '',
        },
        credTxId: '63bc420636ee160502f2fd4f', // TODO: update with prod id
        credentialURL:
          'https://dev-verify.trag-vlinder.io/credentials/TRAGV/fb89addf-fcdf-4486-9290-203a671b4ca0', // TODO: update with prod id
        organization: 'Diageo',
        organizationLogo:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.diageo-demo/diageo-india.png',
        iconURL:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.production/fg.png',
        ProvStepImages: {
          provImages: [
            {
              image:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/auth_seal.png',
            },
          ],
        },
        ProvStepTitleCard: {
          title: '',
          extraInfo: [],
        },
        ChipList: {
          rightIconName: 'attachment',
          rightIconType: 'entypo',
          rightIconColor: '#000',
          rightIconSize: 20,
          chipItems: [],
        },
        ProvDetailInfo: {
          tag: 'godawanGlassBottle',
          title: 'Signature Seal of Authenticity',
          subtitle: '',
          aboutProvInfo:
            'The Signature Seal is a marker of the authentic sourcing of natural ingredients. As a symbol, this represents our commitment to creating the greenest whisky in India.',
          provInfoList: [
            {
              label: '',
              value: '',
            },
          ],
        },
        provMapProps: {geojson: {}},
      },
      {
        id: 2,
        persona: {
          personaName: '',
          sdrPersonaTx: '',
          altFieldMap: {
            mappedCount: 1,
            isAltmapFound: true,
          },
        },
        ProvStepTitle: {
          title: '',
          _id: '',
        },
        credTxId: '63bc420636ee160502f2fd4f', // TODO: update with prod id
        credentialURL:
          'https://dev-verify.trag-vlinder.io/credentials/TRAGV/fb89addf-fcdf-4486-9290-203a671b4ca0', // TODO: update with prod id
        organization: 'Diageo',
        organizationLogo:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.diageo-demo/diageo-india.png',
        iconURL:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.production/fg.png',
        ProvStepImages: {
          provImages: [
            {
              video:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/prod/for_blender_reduced_uT8v3uECS.mp4',
              type: 'video',
            },
            {
              image:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/prod/Louis-Martin.jpeg',
              type: 'image',
            },
          ],
        },
        ProvStepTitleCard: {
          title: '',
          extraInfo: [],
        },
        ChipList: {
          rightIconName: 'attachment',
          rightIconType: 'entypo',
          rightIconColor: '#000',
          rightIconSize: 20,
          chipItems: [],
        },
        ProvDetailInfo: {
          tag: 'godawanGlassBottle',
          title: 'Our Master Blender – Louise Martin',
          subtitle: '',
          aboutProvInfo:
            '<p>Behind every inspired creation is a masterful creator. With Louise Martin, our master blender, Signature is no exception. Having crafted renowned Scotch whiskies like Johnny Walker Gold and Grand Old Parr, she goes against the grain of sameness.</p><p>From Scotland to India, her journey of craft makes every sip of these new blends a revelation.</p>',
          provInfoList: [],
        },
        provMapProps: {geojson: {}},
      },
      {
        id: 3,
        persona: {
          personaName: '',
          sdrPersonaTx: '',
          altFieldMap: {
            mappedCount: 1,
            isAltmapFound: true,
          },
        },
        ProvStepTitle: {
          title: '',
          _id: '',
        },
        credTxId: '',
        credentialURL: '',
        organization: 'Diageo',
        organizationLogo:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.diageo-demo/diageo-india.png',
        iconURL:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.production/fg.png',
        ProvStepImages: {
          provImages: [
            {
              image:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/barley.jpg',
            },
          ],
        },
        ProvStepTitleCard: {
          title: '',
          extraInfo: [],
        },
        ChipList: {
          rightIconName: 'attachment',
          rightIconType: 'entypo',
          rightIconColor: '#000',
          rightIconSize: 20,
          chipItems: [],
        },
        ProvDetailInfo: {
          tag: 'godawanGlassBottle',
          title: 'Ingredients from Best Farms',
          subtitle: '',
          aboutProvInfo:
            "<p>The whisky we make is a blend of Indian 6-row malted barley and Scottish 2-row malted barley, giving it a rich and sweet taste.</p><p>This delightful whisky holds a blend from two different countries. We use natural ingredients from Scotland's golden fields and India's lush grasslands.</p>",
          provInfoList: [],
        },
        provMapProps: {geojson: {}},
      },
      {
        id: 4,
        persona: {
          personaName: '',
          sdrPersonaTx: '',
          altFieldMap: {
            mappedCount: 1,
            isAltmapFound: true,
          },
        },
        ProvStepTitle: {
          title: '',
          _id: '',
        },
        credTxId: '',
        credentialURL: '',
        organization: 'Diageo',
        organizationLogo:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.diageo-demo/diageo-india.png',
        iconURL:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.production/fg.png',
        ProvStepImages: {
          provImages: [
            {
              video:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/prod/for_liquid_reduced_OaN3KJEfZ.mp4',
              type: 'video',
            },
            {
              image:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/prod/our-liquid-taste.png',
            },
          ],
        },
        ProvStepTitleCard: {
          title: '',
          extraInfo: [],
        },
        ChipList: {
          rightIconName: 'attachment',
          rightIconType: 'entypo',
          rightIconColor: '#000',
          rightIconSize: 20,
          chipItems: [],
        },
        ProvDetailInfo: {
          tag: 'godawanGlassBottle',
          title: 'Our Liquid Taste',
          subtitle: '',
          aboutProvInfo:
            '<p><u><strong>Signature Premier</strong></u></p><p><strong>SMOOTH &amp; CREAMY</strong></p><p>Smoothness elevated to new heights, with a dash of fruitiness and a tinge of maltiness.</p><p>Flavour Notes</p><ul> <li>Fresh fruit</li><li>Honey</li><li>Vanilla</li><li>Malt&nbsp;</li></ul>',
          provInfoList: [],
        },
        provMapProps: {geojson: {}},
      },
      {
        id: 5,

        ProvStepTitle: {
          title: '',
          _id: '',
        },
        credTxId: '',
        credentialURL: '',
        organization: 'Diageo',
        organizationLogo:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.diageo-demo/diageo-india.png',
        iconURL:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.production/fg.png',
        ProvStepImages: {
          provImages: [
            {
              image:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/singature_guala_cap.png',
            },
          ],
        },
        ProvStepTitleCard: {
          title: '',
          extraInfo: [],
        },
        ChipList: {
          rightIconName: 'attachment',
          rightIconType: 'entypo',
          rightIconColor: '#000',
          rightIconSize: 20,
          chipItems: [],
        },
        ProvDetailInfo: {
          tag: 'godawanGlassBottle',
          title: 'Sealed With Care',
          subtitle: '',
          aboutProvInfo: 'Our caps are tamper evident & sourced from Goa.',
          provInfoList: [],
        },
        provMapProps: {geojson: {}},
      },
      {
        id: 6,
        persona: {
          personaName: '',
          sdrPersonaTx: '',
          altFieldMap: {
            mappedCount: 1,
            isAltmapFound: true,
          },
        },
        ProvStepTitle: {
          title: '',
          _id: '',
        },
        credTxId: '',
        credentialURL: '',
        organization: 'Diageo',
        organizationLogo:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.diageo-demo/diageo-india.png',
        iconURL:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.production/fg.png',
        ProvStepImages: {
          provImages: [
            {
              video:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/prod/for_bottle_reduced_NMBizTrln.mp4',
              type: 'video',
            },
            {
              image:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/prod/image-3.png',
            },
          ],
        },
        ProvStepTitleCard: {
          title: '',
          extraInfo: [],
        },
        ChipList: {
          rightIconName: 'attachment',
          rightIconType: 'entypo',
          rightIconColor: '#000',
          rightIconSize: 20,
          chipItems: [],
        },
        ProvDetailInfo: {
          tag: 'godawanGlassBottle',
          title: 'Bottled With Care',
          subtitle: '',
          aboutProvInfo:
            '<p>Each Signature Bottle carries a unique emboss & seal, markers of detail & recognition.</p><p>Our Signature bottles carry a unique emboss & seal, unique recognition markers. Our bottles care for Nature as we use 40% Post Consumer Recycled (PCR) glass during the manufacturing of glass bottles to reduce the overall energy footprint of glass processing.</p>',
          provInfoList: [],
        },
        provMapProps: {geojson: {}},
      },
      {
        id: 7,
        persona: {
          personaName: '',
          sdrPersonaTx: '',
          altFieldMap: {
            mappedCount: 1,
            isAltmapFound: true,
          },
        },
        ProvStepTitle: {
          title: '',
          _id: '',
        },
        credTxId: '',
        credentialURL: '',
        organization: 'Diageo',
        organizationLogo:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.diageo-demo/diageo-india.png',
        iconURL:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.production/fg.png',
        ProvStepImages: {
          provImages: [
            {
              image:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/prod/bottling.jpeg',
            },
          ],
        },
        ProvStepTitleCard: {
          title: '',
          extraInfo: [],
        },
        ChipList: {
          rightIconName: 'attachment',
          rightIconType: 'entypo',
          rightIconColor: '#000',
          rightIconSize: 20,
          chipItems: [],
        },
        ProvDetailInfo: {
          tag: 'godawanGlassBottle',
          title: 'Bottled At',
          subtitle: '',
          aboutProvInfo: '',
          provInfoList: [],
        },
        provMapProps: {geojson: {}},
      },
      {
        id: 8,
        persona: {
          personaName: 'Customer',
          sdrPersonaTx: '60cb4e990101a80a6824ce80',
          altFieldMap: {
            mappedCount: 1,
            isAltmapFound: true,
          },
        },
        ProvStepTitle: {
          title: '',
          _id: '',
        },
        credTxId: '',
        credentialURL: '',
        organization: 'Diageo',
        organizationLogo:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.diageo-demo/diageo-india.png',
        iconURL:
          'https://s3.ap-south-1.amazonaws.com/io.trag-vlinder.production/fg.png',
        ProvStepImages: {
          provImages: [
            {
              image:
                'https://diageo-signature-poc-demo.s3.ap-south-1.amazonaws.com/prod/label.jpeg',
            },
          ],
        },
        ProvStepTitleCard: {
          title: '',
          extraInfo: [],
        },
        ChipList: {
          rightIconName: 'attachment',
          rightIconType: 'entypo',
          rightIconColor: '#000',
          rightIconSize: 20,
          chipItems: [],
        },
        ProvDetailInfo: {
          tag: 'godawanGlassBottle',
          title: 'Labelled With Nature',
          subtitle: '',
          aboutProvInfo:
            '<p>The labels we use are made from crafted paper and are certified by the FSC as a marker of responsible forestry. Additionally, we use MO-free ink for printing purposes.</p>',
          provInfoList: [],
        },
        provMapProps: {geojson: {}},
      },
    ],
  };
}
