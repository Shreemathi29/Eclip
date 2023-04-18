/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const ProvenanceTypedefs = gql`
  extend type Query {
    getProvenance(provenanceId: String!): Provenance
    checkProvForDefaultBatch(gtin: ID!): checkProvForDefaultBatchOutput
    provenanceTable(
      criteria: filterByForProvTable
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): JSON
  }

  extend type Mutation {
    issueProvCredential(
      credentialKeyVals: [credentialKeyVal!]!
      credTempKey: String!
    ): JSON
    createProvenance(
      name: String!
      provenanceTemplate: ID!
      provSteps: [provStepsInput]!
    ): Provenance
    updateProvenance(
      provId: ID!
      type: String!
      unlink: Boolean
      data: updateProvInput!
    ): Provenance
    uploadFile(name: String!, data: String!): String
  }

  type OCRResponse {
    dynamsoftBarcode: String
    barcode: String
    fssai: String
    batch: String
    mfgDate: String
  }

  type checkProvForDefaultBatchOutput {
    exists: Boolean
    message: String
  }

  input updateProvInput {
    product: ID!
    batch: ID
    gtin: ID!
  }

  input provStepsInput {
    credTxs: [ProvTempCredentialTxInput]!
    parentCredTx: ProvTempParentCredTxInput!
    title: String!
    subtitle: String!
  }

  input ProvTempParentCredTxInput {
    credentialContent: ProvTempCredentialContentInput!
    credentialTemplate: ID!
  }

  input ProvTempCredentialTxInput {
    credentialTemplate: ID!
    credentialContent: ProvTempCredentialContentInput!
  }

  input ProvTempCredentialContentInput {
    credentialSubject: JSON!
    evidences: [String]
    geoJSON: JSON
    images: [String]
  }

  input valueInput {
    type: String!
    required: Boolean!
    value: String!
  }

  input filterByForProvTable {
    product: String
    provenance: String
    provenance_in: [String]
    gtin: String
    plantCode: String
    mfgDate: String
    batch: String
    download: Boolean
  }

  input credentialKeyVal {
    key: String!
    value: String!
  }

  type CredentialContent {
    credentialSubject: JSON
    evidences: [String]
    images: [String]
  }

  type AllCliamKeys {
    keys: [String]
  }

  type TemplateStyle {
    _id: ID
    name: String
    labelKey: String
    description: String
    templateId: String
    credentialContent: CredentialContent
    getAllClaimKeys: AllCliamKeys
  }

  type CredentialSubjectKeyVals {
    key: String
    value: String
    values: [String]
    label: String
  }

  type ProvenanceTx {
    _id: ID
    createdAt: GDate
    updatedAt: GDate
    vcTag: String
  }

  type Org {
    _id: ID
    sameAs: String
    telephone: String
    description: String
    name: String
    email: String
    creator: String
    fullAddress: String
    logo: String
    image: String
    createdAt: GDate
    updatedAt: GDate
    provCredentials: [ProvenanceTx]
  }

  type CredIssuedTo {
    org: Org
  }

  type CredIssuer {
    iat: GDate
    exp: GDate
    organization: Org
  }

  type Cred {
    _id: ID
    createdAt: GDate
    updatedAt: GDate
    tag: String
    name: String
    from: String
    to: String
    state: String
    type: String
    issuer: CredIssuer
    issuedTo: CredIssuedTo
  }

  type CredentialTx {
    _id: ID
    createdAt: GDate
    updatedAt: GDate
    vcTag: String
    credentialTemplate: TemplateStyle
    credential: Cred
    credentialContent: CredentialContent
    credentialSubjectKeyVals: [CredentialSubjectKeyVals]
  }
  type ParentCredTx {
    _id: ID
    createdAt: GDate
    updatedAt: GDate
    vcTag: String
    credentialTemplate: TemplateStyle
    credential: Cred
    credentialContent: CredentialContent
    credentialSubjectKeyVals: [CredentialSubjectKeyVals]
  }

  type ProvStep {
    credTxs: [CredentialTx]
    parentCredTx: CredentialTx
    title: String
    subtitle: String
  }

  type Provenance {
    _id: ID
    name: String
    description: String
    creatorUser: String
    product: Product
    batch: Batch
    mfgDate: String
    provenanceTemplate: String
    provSteps: [ProvStep]
    updatedAt: GDate
    createdAt: GDate
  }
  type ProvenanceRowData {
    batch: String
    batchId: String
    description: String
    product: String
    productId: String
    provenance: String
    provenanceId: String
    status: String
  }
  type ProvenanceData {
    columnDefs: [ColumnDefs]
    rowData: [ProvenanceRowData]
  }
  type ProvenanceTableOutput {
    data: ProvenanceData
    count: Int
    sort: String
  }
`;
