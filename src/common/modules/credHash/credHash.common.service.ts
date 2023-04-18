/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {bind, BindingScope, inject} from '@loopback/context';
import {Context} from 'vm';
import {Provenance} from '../provenance';
import {CredHash} from './credHash.model';

export enum sortOrder {
  asc = 'asc',
  desc = 'desc',
}

@bind({scope: BindingScope.SINGLETON})
export class CredHashCommonService extends RequestCtxAbs {
  constructor(@inject.context() protected ctx: Context) {
    super(ctx);
  }
  // @ts-ignore
  // @authAndAuthZ('read', 'credHash')
  async getProvsForCredHash({credId}: {credId: string}) {
    const credHash = await CredHash.findOne({_id: credId});
    const allCredHashes = await CredHash.find({hash: credHash?.hash})
      .limit(10000)
      .select('_id');
    const $in = allCredHashes.map(x => x._id);
    const provs = await Provenance.find({
      $or: [{'provSteps.credTxs': {$in}}, {'provSteps.parentCredTx': {$in}}],
    }).select('_id');
    const provIds = provs.map(x => x._id);
    return {provIds};
  }
}
