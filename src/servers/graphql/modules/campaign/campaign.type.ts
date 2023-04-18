/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const CampaignTypeDefs = gql`
  enum campaignStatus {
    active
    disabled
    created
  }
  type CampaignRowData {
    batch: String
    batchId: String
    campaign: String
    campaignId: String
    gtin: String
    gtinId: String
    status: String
  }
  type CampaignData {
    columnDefs: [ColumnDefs]
    rowData: [CampaignRowData]
  }
  type CampaignTableOutput {
    count: Int
    data: CampaignData
  }
  type CreateCampaignOutput {
    name: String
    description: String
    status: campaignStatus
    data: [CampaignTemplateData]
    campaignTemplateId: [ID]
    creatorUser: ID
    createdAt: GDate
    updatedAt: GDate
  }

  input CampaignTemplateDataInput {
    type: String
    typeProps: TypePropsInput
  }

  input TypePropsInput {
    title: TitleInput
    message: MessageInput
    comp: CompInput
    button: ButtonInput
    footer: FooterInput
  }

  input textStyleInput {
    color: String
  }

  input TitleInput {
    primaryTitle: String
    secondaryTitle: String
    text: String
    textStyle: textStyleInput
  }

  input MessageInput {
    text: String
    textStyle: textStyleInput
  }

  input CompInput {
    uri: [String]
    resizeMode: String
    posterUri: String
    content: String
  }

  input ButtonInput {
    color: String
    shadowColor: String
    buttonColor: String
    titleColor: String
    text: String
    uri: String
  }

  input FooterInput {
    backgroundColor: String
    smallText: String
    text: String
  }
  input CampaignItem {
    item: ID!
    variant: ID!
    batch: ID!
  }
  input filterByForCampaignTable {
    name: String
    status: campaignStatus
    startDate: GDate
    endDate: GDate
  }
  extend type Query {
    campaignTable(
      criteria: filterByForCampaignTable
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): JSON
    getCampaign(campaignId: ID!): JSON
  }
  extend type Mutation {
    createCampaign(
      name: String!
      description: String!
      status: campaignStatus!
      data: [CampaignTemplateDataInput]!
      campaignTemplateId: [ID]!
    ): CreateCampaignOutput

    editCampaign(
      campaignId: ID!
      description: String
      data: [CampaignTemplateDataInput]
    ): CreateCampaignOutput

    associateProductsToCampaign(
      campaignId: ID!
      products: [CampaignItem]!
    ): JSON

    editCampaignStatus(
      campaignId: ID!
      status: campaignStatus!
    ): CreateCampaignOutput

    duplicateCampaign(
      campaignId: ID!
      name: String!
      description: String!
    ): CreateCampaignOutput

    removeCampaignProduct(
      campaignId: ID!
      item: ID!
      variant: ID!
      batch: ID!
    ): JSON
  }
`;
