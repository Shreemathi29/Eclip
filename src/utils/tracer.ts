/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
// import {fillTemplate} from './utils/fillTemplate';

import {EnvModule} from './EnvModule';
import {fillTemplate} from './fillTemplate';

const opentracing = require('opentracing');
const initTracer = require('jaeger-client').initTracer;
const pkg = require('../../package.json');

const env = EnvModule?.getInstance()?.getEnv();
const APP_NAME = env?.APP_NAME;
const MODIFIED_APP_NAME = 'dc-${dc}-' + APP_NAME + '-i${instance}';

const serviceName = fillTemplate(MODIFIED_APP_NAME, {
  dc: env?.DATA_CENTER,
  version: pkg.version,
  instance: env?.INSTANCE,
});

const _config = {
  serviceName,
  reporter: {
    logSpans: true,
  },
  sampler: {
    type: 'const',
    param: 1,
  },
};
const options = {
  tags: {
    [serviceName]: pkg.version,
    instance: process.env.SERVICE_INSTANCE,
    platform: process.env.SERVICE_PLATFORM,
  },
};
export const tracer = initTracer(_config, options);
opentracing.initGlobalTracer(tracer);

export const tracingMiddleWare = (req: any, res: any) => {
  // Extracting the tracing headers from the incoming http request
  // req.headers['X-Request-Id'] = uuidv4();
  const wireCtx = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers);
  // Creating our span with context from incoming request
  const span = tracer.startSpan(req.path, {childOf: wireCtx});
  // Use the log api to capture a log
  span.log({event: 'request_received'});

  // Use the setTag api to capture standard span tags for http traces
  span.setTag(opentracing.Tags.HTTP_METHOD, req.method);
  span.setTag(
    opentracing.Tags.SPAN_KIND,
    opentracing.Tags.SPAN_KIND_RPC_SERVER,
  );
  span.setTag(opentracing.Tags.HTTP_URL, req.path);
  span.setTag('X-Request-Id', req.headers['X-Request-Id']);

  // include trace ID in headers so that we can debug slow requests we see in
  // the browser by looking up the trace ID found in response headers
  const responseHeaders = {};
  tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, responseHeaders);
  res.set(responseHeaders);

  // add the span to the request object for any other handler to use the span
  Object.assign(req, {span});

  // finalize the span when the response is completed
  const finishSpan = () => {
    if (res.statusCode >= 500) {
      // Force the span to be collected for http errors
      span.setTag(opentracing.Tags.SAMPLING_PRIORITY, 1);
      // If error then set the span to error
      span.setTag(opentracing.Tags.ERROR, true);

      // Response should have meaning info to futher troubleshooting
      span.log({event: 'error', message: res.statusMessage});
    }
    // Capture the status code
    span.setTag(opentracing.Tags.HTTP_STATUS_CODE, res.statusCode);
    span.log({event: 'request_end'});
    span.finish();
  };
  res.on('finish', finishSpan);
};
