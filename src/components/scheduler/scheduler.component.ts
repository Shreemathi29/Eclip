import {log} from '@/utils/logging';
import {
  Component,
  CoreBindings,
  inject,
  LifeCycleObserver,
} from '@loopback/core';
import nodeSchedule from 'node-schedule';
import {VApplication} from '../../application';
import {AnalyticsJobHandlerService} from './analytics.jobHandler.service';

// ----------------------------------------

// ---------------------------------------------------------------
export class SchedulerComponent implements Component, LifeCycleObserver {
  // ...
  status = 'not-initialized';
  initialized = false;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: VApplication,
  ) {
    this.setupBindings();
    this.app.service(AnalyticsJobHandlerService);
  }

  async init() {
    this.status = 'initialized';
    this.initialized = true;
    // console.log('==> success: common module initialized');
  }

  async start() {
    // ------------------------------
    this.setupJob();
    this.status = 'started';
    log.info('==> success: SchedulerComponent started');
  }

  async stop() {
    this.status = 'stopped';
    log.info('==> SchedulerComponent stopped');
  }

  setupBindings() {}

  setupJob() {
    const analyticJobHandlerService = this.app.getSync(
      'services.AnalyticsJobHandlerService',
    ) as AnalyticsJobHandlerService;
    const rule = new nodeSchedule.RecurrenceRule();
    rule.second = 1;
    const scheduleRuleString = process.env.SCHEDULER_SCHEDULE_RULE;
    log.info(`schedule rule = ${scheduleRuleString}`);
    if (!scheduleRuleString) throw new Error(`no schedule rule is present`);
    // ('1 * * * * * ');
    nodeSchedule.scheduleJob(
      scheduleRuleString,
      analyticJobHandlerService.job.bind(analyticJobHandlerService),
    );
    if (process.env.SCHEDULER_RUN_IMMEDIATELY?.toLowerCase() === 'true') {
      analyticJobHandlerService.job();
    }
    log.info(`scheduler started, ${scheduleRuleString}`);
  }
  // _getElasticSearchIndex() {
  // 	// const today = moment();

  // 	return `logs-${pkg.name}-${pkg.version}-node-${
  // 		process.env.NODE_ENV || 'dev'
  // 	}`;
  // }
}
