import {log} from '@/utils';

export function logStage(target: any, propertyName: any, descriptor: any) {
  const method = descriptor.value;
  descriptor.value = async function (...args: any) {
    log.info(`init stage: ${propertyName}. provId: ${this.provenance?._id}`);
    const ret = await method.apply(this, args);
    log.info(`finish stage: ${propertyName}. provId: ${this.provenance?._id}`);
    return ret;
  };
}

export function augmentError(target: any, propertyName: any, descriptor: any) {
  const method = descriptor.value;
  descriptor.value = async function (...args: any) {
    try {
      const ret = await method.apply(this, args);
      return ret;
    } catch (error: any) {
      error.message =
        `error at stage ${propertyName} ==>` + (error.message || '');
      throw error;
    }
  };
}
