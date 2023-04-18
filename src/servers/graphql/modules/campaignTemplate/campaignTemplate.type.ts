/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const CampaignTemplateTypedefs = gql`
  extend type Query {
    getCampaignTemplates: [CampaignTemplateData]
  }

  type CampaignTemplateData {
    _id: ID
    type: String
    typeProps: CampaignTypeProps
    updatedAt: GDate
    createdAt: GDate
  }

  type CampaignTypeProps {
    title: Title
    message: Message
    comp: Comp
    button: Button
    footer: Footer
  }

  type Title {
    primaryTitle: String
    secondaryTitle: String
    text: String
    textStyle: TextStyle
  }

  type TextStyle {
    color: String
  }

  type Message {
    text: String
    textStyle: TextStyle
  }

  type Comp {
    uri: [String]
    resizeMode: String
    posterUri: String
    content: String
  }

  type Button {
    color: String
    shadowColor: String
    buttonColor: String
    titleColor: String
    text: String
    uri: String
  }

  type Footer {
    backgroundColor: String
    smallText: String
    text: String
  }
`;
