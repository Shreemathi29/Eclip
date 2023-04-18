/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const ProvTemplateTypedefs = gql`
  extend type Query {
    getProvTemplates: [ProvenanceTemplate]
  }

  type ProvenanceTemplate {
    _id: ID
    name: String
    type: String
    provSteps: [ProvTempStep]
    updatedAt: GDate
    createdAt: GDate
  }

  type ProvTempStep {
    credTxs: [ProvTempCredentialTx]
    parentCredTx: ProvTempParentCredTx
    title: String
    subtitle: String
  }

  type ProvTempCredentialTx {
    credentialTemplate: ID
    credentialContent: ProvTempCredentialContent
  }

  type ProvTempParentCredTx {
    credentialContent: ProvTempCredentialContent
    credentialTemplate: ID
  }

  type ProvTempCredentialContent {
    credentialSubject: JSON
    evidences: [String]
    geoJSON: JSON
    images: [String]
  }
`;
