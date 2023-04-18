/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {VApplication} from '@/application';
import {bind, BindingScope, config, CoreBindings, inject} from '@loopback/core';
import {log} from '@utils/index';
import _ from 'lodash';
import {WorkerService} from '@vlinder-be/worker-service-node';

const is = require('is_js');

export function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomSleep(min: number, max: number) {
  return sleep(randomIntFromInterval(min, max));
}

export interface IWorker {
  name: string;
  config: {
    priority: number;
    timeout: number;
    attempt: number;
  };
  cb?({
    id,
    payload,
    name,
    lbApp,
  }: {
    id: any;
    payload: any;
    lbApp: any;
    name: string;
  }): any;
}

export interface IWorkerServiceOptions {
  path: string;
  schemaVersion: number;
  workers: IWorker[];
}

@bind({scope: BindingScope.SINGLETON})
export class WorkerClientService {
  private queue: any;
  constructor(
    @config() private options: IWorkerServiceOptions,
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: VApplication,
  ) {}

  async init(start = true) {
    const patronService = new WorkerService(this.options);
    await patronService.init();
    const queue = patronService.getQueue();
    this.queue = queue;

    if (
      this.options.workers &&
      is.array(this.options.workers) &&
      is.not.empty(this.options.workers)
    ) {
      this.options.workers.forEach((worker: IWorker) => {
        this.queue.addWorker(worker?.name, async (id: any, payload: any) => {
          if (worker.cb) {
            await worker.cb({
              id: id,
              payload: payload,
              name: worker?.name,
              lbApp: this.app,
            });
          }
        });
      });
    }

    if (start) {
      queue?.start();
    }
  }

  getQueue() {
    return this.queue;
  }

  async createJob(name: string, payload: any) {
    if (name && is.not.empty(name)) {
      const found = _.find(this.options.workers, {name: name});
      if (found && found.config) {
        this.queue?.createJob(name, payload, found.config);
      } else {
        log.error(`could not find config for job: ${name}`);
      }
    }
  }
}
