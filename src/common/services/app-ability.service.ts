/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {Ability, ForcedSubject, RawRuleOf} from '@casl/ability';

export const RoleActions = [
  'manage',
  'create',
  'read',
  'update',
  'delete',
] as const;

export const RoleSubjects = [
  'all',
  'SAP',
  'DISPATCH',
  'Report',
  'Fuse',
  'Credential',
  'Application',
  'Bundle',
  'Holder',
  'Role',
  'User',
  'Organization',
  'VPR',
  'VP',
  'CredentialTemplate',
  'Analytics',
  'Batch',
  'Campaign',
  'Category',
  'Counter',
  'CredentialTransaction',
  'Encode',
  'Feedback',
  'FullProvenance',
  'Manufacturer',
  'NetworkGraph',
  'Product',
  'Provenance',
  'ProvTemplates',
  'SerializationGroup',
  'EntityRange',
  'ScanLog',
  'Variant',
  'Persona',
  'SDRPersonaTx',
  'TOSLog',
  'BatchLazyBindingParent',
] as const;

export type AppAbilities = [
  typeof RoleActions[number],
  (
    | typeof RoleSubjects[number]
    | ForcedSubject<Exclude<typeof RoleSubjects[number], 'all'>>
  ),
];
export type AppAbility = Ability<AppAbilities>;
export const createAbility = (rules: RawRuleOf<AppAbility>[]) =>
  new Ability<AppAbilities>(rules);
