import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {log} from '@/utils';
import {bind, BindingScope, inject} from '@loopback/core';
import {Context} from 'vm';
import {LateBindingCounter} from './lateBindingCounter.model';

@bind({scope: BindingScope.SINGLETON})
export class LateBindingCounterCommonService extends RequestCtxAbs {
  constructor(@inject.context() protected ctx: Context) {
    super(ctx);
  }

  @authAndAuthZ('read', 'Counter')
  public async getSerializationGroupInc() {
    const ret = await LateBindingCounter.findOneAndUpdate(
      {type: 'serializationGroup'},
      {$inc: {counter: 1}, $setOnInsert: {type: 'serializationGroup'}},
      {upsert: true, new: true},
    );
    log.debug(`serializationGroup counter incrimented ==> ${ret.counter}`);
    return {serializationGroupCounter: ret.counter};
  }

  @authAndAuthZ('read', 'Counter')
  public async getBatchLazyBindingParent(dateKey: string) {
    const ret = await LateBindingCounter.findOneAndUpdate(
      {type: 'batchLazyBindingParent', dateKey: dateKey},
      {
        $inc: {counter: 1},
        $setOnInsert: {type: 'batchLazyBindingParent', dateKey: dateKey},
      },
      {upsert: true, new: true},
    );
    log.debug(`batchLazyBindingParent counter incrimented ==> ${ret.counter}`);
    return ret;
  }
}
