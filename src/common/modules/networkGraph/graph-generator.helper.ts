/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {IBrand} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';

export interface VC {
  hash: string;
  verifiableCredential?: {
    issuer: {
      id: string;
      profile?: {
        name?: string;
        type?: 'organization' | 'thing' | 'app' | 'person';
        logo?: string;
        image?: string;
        pk?: string;
        sameAs?: string;
        email?: string;
        alias?: string;
      };
    };
    credentialSubject: {
      alias: string;
      id: string;
      [key: string]: any;
    };
    id: string;
    type: string[];
    credentialStatus: {
      id: string;
      type: string;
      decoded?: {
        claim: {
          id: string;
          currentStatus: string;
          statusReason: string;
        };
        issued: string;
      }[];
    };
    '@context': string[];
    issuanceDate: string;
    expirationDate?: string;
    proof?: {
      type: string;
      jwt: string;
    };
  };

  verifiablePresentation?: any;
}

interface WalletHolder {
  email: string;
  givenName: string;
  familyName: string;
  image: string;
  wallet: {
    did?: string;
    pk?: string;
  };
}

export class GraphGeneratorService {
  private credentials: VC[];
  private org?: IBrand | null;
  private actualEdgecount?: number;
  private nodes: any = {};
  private edges: any[] = [];
  private lastEdge?: VC;
  private allWalletHolders?: WalletHolder[];
  // private allOrgs?: IBrand[];
  private users: WalletHolder[];
  private nodeDetails: any[];
  private nodesArray: any[];
  constructor({
    credentials,
    org,
    users,
    actualEdgecount,
  }: {
    credentials: VC[];
    org?: IBrand | null;
    users: WalletHolder[];
    actualEdgecount?: number;
  }) {
    this.actualEdgecount = actualEdgecount;
    this.org = org;
    this.credentials = credentials;
    this.users = users;
  }

  async generate() {
    // await this.getUsersAndOrganizationData();
    await this.processVCs();
    this.ammendOrganizationNode();
    this.addNodesAndNodeDetails();
    return {
      id: 'klefki_network_graph',
      graphs: {
        nodes: this.nodesArray,
        edges: this.edges,
        nodeDetails: this.nodeDetails,
      },
      actualEdgecount: this.actualEdgecount,
    };
  }

  private async processVCs() {
    let id = 0;
    // console.log('this.lastEdge', this.lastEdge);
    // console.log('this.lastEdge?.decoded', this.lastEdge?.decoded);
    this.credentials.forEach((ele: any) => {
      if (
        !this.isVerifiableCredential(ele) &&
        !this.isVerifiablePresentation(ele)
      )
        return;

      id = id + 1;
      this.addEdges(id, ele);
      this.addToNode(id, ele); //* we dont get to node from trust graph , has to be filled from db
      this.addFromNode(id, ele);
      if (this.isVerifiableCredential(ele))
        this.addPlainVerifiableCredentialNode(id, ele);
      if (this.isVerifiablePresentation(ele))
        this.addVerifiablePresentaionNode(id, ele);
      // } else {
    });
  }

  private addNodesAndNodeDetails() {
    this.nodesArray = Object.values(this.nodes);
    // ! movind details from inside nodes  to ourtside
    this.nodeDetails = this.nodesArray.map((val: any) => {
      return {
        image: val.image,
        title: val.title,
        id: val.id,
        details: val.details,
      };
    });
  }

  private ammendOrganizationNode() {
    if (this.org?.did) {
      // is of organization context
      const did = this.org.did;
      const ttl = this.org.name || 'Identity';
      const letters = ttl.slice(0, 3);
      this.nodes[did] = {
        id: did,
        title: ttl,
        nodeType: 'identity',
        image:
          this.org.logo ??
          this.lastEdge?.verifiableCredential?.issuer?.profile?.logo ??
          'https://ui-avatars.com/api/?name=' +
            letters +
            '&background=03B8FF&color=FFFB73',
        details: [
          {
            key: 'Website',
            value:
              this.org.sameAs ??
              this.lastEdge?.verifiableCredential?.issuer?.profile?.sameAs,
          },
          {
            key: 'did',
            value:
              this.org.did ?? this.lastEdge?.verifiableCredential?.issuer?.id,
          },
        ],
        size: 40,
        fullName: ttl,
        email: this.org.email,
        vidTooltip: this.org.did,
      };
    }
  }

  private isVerifiablePresentation(ele: VC) {
    return !!ele.verifiablePresentation;
  }

  private isVerifiableCredential(ele: VC) {
    return !!ele.verifiableCredential;
  }
  private addEdges(id: number, ele: VC) {
    let to: string | undefined;
    let from: string | undefined;

    if (this.isVerifiableCredential(ele)) {
      to = ele.verifiableCredential?.credentialSubject?.id;
      from = ele.verifiableCredential?.issuer.id;
    } else {
      to = ele.verifiablePresentation?.id;
      from = ele.verifiablePresentation?.issuer?.id;
    }

    this.edges.push({
      id: from + '_' + id,
      to: id,
      from: from,
      // label: ele.status,
    });

    this.edges.push({id: id + '_' + to, to: to, from: id});
  }

  private getWalletHolder(email: string) {
    return this.allWalletHolders?.find(
      x => x.email?.trim()?.toLowerCase() === email?.trim().toLowerCase(),
    );
  }

  private constructNodeData(
    id: number,
    ele: VC,
    // type: string,
    user?: WalletHolder | null,
    org?: IBrand | null,
  ) {
    let logoLetters: string | undefined;
    let image: string | undefined;
    const userFullName =
      (user?.givenName ?? '') + ' ' + (user?.familyName ?? '');
    const name = userFullName ?? org?.name;
    image = user?.image ?? org?.logo;
    if (!image) {
      if (user) {
        const letter1 = user.givenName?.charAt(0) || '';
        let letter2 = user.familyName?.charAt(0) || '';
        if (!letter2) letter2 = user.givenName?.charAt(1) || '';
        logoLetters = letter1 + letter2;
      }
      if (!logoLetters) logoLetters = name?.slice(0, 3);

      if (!logoLetters) logoLetters = user?.email?.slice(0, 3) ?? 'ID';
    }
    if (!image)
      image =
        'https://ui-avatars.com/api/?name=' +
        logoLetters +
        '&background=03B8FF&color=FFFB73';
    const email = user?.email ?? org?.email;
    const website = org?.sameAs;
    const nodeDetails: {key: string; value: string}[] = [];
    // if (type === 'from') {
    // 	website = ele?.decoded?.issuer?.sameAs || website;
    // 	image = ele?.decoded?.issuer?.sameAs || image;
    // }

    if (email)
      nodeDetails.push({
        key: 'Email',
        value: email,
      });
    if (website)
      nodeDetails.push({
        key: 'Website',
        value: website,
      });
    return {name, image, nodeDetails};
  }

  private addToNode(id: number, ele: VC) {
    let org: IBrand | null | undefined;
    let user: WalletHolder | null | undefined;
    let to: string;
    // -----------
    if (this.isVerifiableCredential(ele)) {
      org = null;
      user = this.users.find(
        usr =>
          usr?.email === ele.verifiableCredential?.credentialSubject?.id ||
          usr?.wallet?.did === ele.verifiableCredential?.credentialSubject?.id,
      );
      to = ele.verifiableCredential?.credentialSubject?.id ?? 'noIDFound';
    } else {
      user = null;
      org = this.org;
      to = ele.verifiablePresentation?.id || 'noIDFound';
    }

    const {name, image, nodeDetails} = this.constructNodeData(
      id,
      ele,
      // 'to',
      user,
      org,
    );

    this.nodes[to || 'default'] = {
      id: to,
      nodeType: 'identity',
      title: name,
      image,
      details: [
        ...nodeDetails,
        {
          key: 'did',
          value: to,
        },
      ],
    };
  }

  private addFromNode(id: number, ele: VC) {
    let org: IBrand | null | undefined;
    let user: WalletHolder | null | undefined;
    let from: string;
    // -----------
    if (this.isVerifiableCredential(ele)) {
      org = this.org;
      user = null;
      from = ele.verifiableCredential?.issuer?.id ?? 'noIDFound';
    } else {
      user = null;
      org = null;
      from = ele.verifiablePresentation?.issuer?.id || 'noIDFound';
    }
    // console.log('ele.type', ele.type);
    const {name, image, nodeDetails} = this.constructNodeData(
      id,
      ele,
      user,
      org,
    );
    this.nodes[from] = {
      id: from,
      title: name,
      nodeType: 'identity',
      image,
      details: [
        ...nodeDetails,
        {
          key: 'did',
          value: from,
        },
      ],
    };
  }

  private addPlainVerifiableCredentialNode(id: number | string, ele: VC) {
    const title =
      ele?.verifiableCredential?.credentialSubject?.name || 'Credential';
    const credSubjectLetters = title?.slice(0, 2);
    this.nodes[id] = {
      id,
      title,
      edgeTag: ele?.verifiableCredential?.id?.split('/').pop(),
      toDID: ele.verifiableCredential?.credentialSubject.id,
      fromDID: ele.verifiableCredential?.issuer?.id,
      image:
        ele?.verifiableCredential?.credentialSubject?.logo ||
        'https://ui-avatars.com/api/?name=' +
          credSubjectLetters +
          '&background=03B8FF&color=FFFB73',
      details: [],
      nodeType: 'credential',
    };
  }

  private addVerifiablePresentaionNode(id: number | string, ele: VC) {
    this.nodes[id] = {
      id,
      title: 'Presentation',
      nodeType: 'presentation',
      // edgeTag: ele?.tag,
      image:
        'https://ui-avatars.com/api/?name=' +
        'PR' +
        '&background=03B8FF&color=FFFB73',
      details: [],
    };
  }
}
