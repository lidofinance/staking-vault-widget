import type { NextApiRequest, NextApiResponse } from 'next';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';
import {
  wrapRequest as wrapNextRequest,
  cacheControl,
} from '@lidofinance/next-api-wrapper';
import { isAddress } from 'viem';

import { config as appConfig, secretConfig } from 'config';
import { API_ROUTES } from 'consts/api';
import {
  defaultErrorHandler,
  responseTimeMetric,
  rateLimit,
  httpMethodGuard,
  HttpMethod,
  cors,
} from 'utilsApi';
import Metrics from 'utilsApi/metrics';
import { createCachedProxy } from 'utilsApi/cached-proxy';

// GET-only route — disable body parsing so a non-GET (or GET with body)
// can't consume up to bodyParser.sizeLimit of memory before
// httpMethodGuard rejects it.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Validate address to prevent SSRF attacks
const validateEthereumAddress = (address: unknown): string | null => {
  if (typeof address !== 'string' || !address) return null;
  if (!isAddress(address)) return null;

  return address.toLowerCase();
};

let handler;
if (!secretConfig.validationAPI) {
  console.info(
    '[api/validation] Skipped setup: secretConfig.validationAPI is null',
  );
  handler = (_: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end();
  };
} else {
  // Create proxy once at module level to preserve cache
  const validationProxy = createCachedProxy({
    proxyUrl: (req) => {
      const validatedAddress = validateEthereumAddress(req.query.address);
      if (!validatedAddress) {
        throw new Error('Invalid address'); // This will be caught by the handler
      }
      const isMainnet = appConfig.defaultChain === CHAINS.Mainnet;
      const path = isMainnet
        ? `/v2/check/${validatedAddress}`
        : `/v1/check/${validatedAddress}`;

      return `${secretConfig.validationAPI}${path}`;
    },
    cacheTTL: 1000,
    ignoreParams: true, // Address is in path, not query
    timeout: 10_000,
    metricsHost: secretConfig.validationAPI,
  });

  handler = (req: NextApiRequest, res: NextApiResponse) => {
    const validatedAddress = validateEthereumAddress(req.query.address);

    if (!validatedAddress) {
      res.status(400).json({
        error: 'Invalid Ethereum address',
        message: 'Address must be a valid Ethereum address format',
      });
      return;
    }

    return validationProxy(req, res);
  };
}

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  cors({ origin: ['*'], methods: [HttpMethod.GET] }),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.VALIDATION),
  cacheControl({ headers: appConfig.CACHE_VALIDATION_HEADERS }),
  defaultErrorHandler,
])(handler);
