import {
  wrapRequest as wrapNextRequest,
  cacheControl,
} from '@lidofinance/next-api-wrapper';
import { metricsFactory } from '@lidofinance/next-pages';

import { API_ROUTES } from 'consts/api';
import { config as appConfig } from 'config';
import { responseTimeMetric, defaultErrorHandler, rateLimit } from 'utilsApi';
import Metrics from 'utilsApi/metrics';

// GET-only Prometheus exposition — scrapers never send a body, so skip
// bodyParser entirely to avoid allocating up to 1MB per request.
export const config = {
  api: {
    bodyParser: false,
  },
};

const metrics = metricsFactory({
  registry: Metrics.registry,
});

export default wrapNextRequest([
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.METRICS),
  cacheControl({ headers: appConfig.CACHE_METRICS_HEADERS }),
  defaultErrorHandler,
])(metrics);
