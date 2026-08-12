import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import { trackedFetchRpcFactory } from '@lidofinance/api-rpc';
import { rpcFactory } from '@lidofinance/next-pages';

// Aliased: `config` is reserved below for Next's route config export.
import { config as appConfig, secretConfig } from 'config';
import { API_ROUTES } from 'consts/api';
import { METRICS_PREFIX } from 'consts/metrics';
import {
  rateLimit,
  responseTimeMetric,
  defaultErrorHandler,
  requestAddressMetric,
  httpMethodGuard,
  HttpMethod,
} from 'utilsApi';
import Metrics from 'utilsApi/metrics';

const allowedRPCMethods = [
  'test',
  'eth_call',
  //'eth_simulateV1', THIS METHOD MIGHT BE NEEDED FOR REPORT SIMULATION BUT DISABLED FOR SECURITY UNLESS REALLY NEEDED
  'eth_gasPrice',
  'eth_getCode',
  'eth_estimateGas',
  'eth_getBlockByNumber',
  'eth_feeHistory',
  'eth_maxPriorityFeePerGas',
  'eth_getBalance',
  'eth_blockNumber',
  'eth_getTransactionByHash',
  'eth_getTransactionReceipt',
  'eth_getTransactionCount',
  'eth_sendRawTransaction',
  'eth_getLogs',
  'eth_chainId',

  'net_version',
];

// FIX(dev mode): prevent duplicate metric registration inside rpcFactory by wrapping it in a globalThis singleton
const g = globalThis as any;
const rpc =
  g.__rpcSingleton__ ??
  rpcFactory({
    fetchRPC: trackedFetchRpcFactory({
      registry: Metrics.registry,
      prefix: METRICS_PREFIX,
    }),
    metrics: {
      prefix: METRICS_PREFIX,
      registry: Metrics.registry,
    },
    defaultChain: `${appConfig.defaultChain}`,
    providers: [1, ...appConfig.supportedChains].reduce(
      (acc, chain) => {
        acc[chain] = secretConfig[`rpcUrls_${chain}`];
        return acc;
      },
      {} as Record<string, [string, ...string[]]>,
    ),

    validation: {
      allowedRPCMethods,
      maxBatchCount: appConfig.PROVIDER_MAX_BATCH,
      blockEmptyAddressGetLogs: true,
      maxGetLogsRange: 20_000, // only 20k blocks size historical queries
      maxResponseSize: 1_000_000, // 1mb max response
    },
  });

if (!g.__rpcSingleton__) g.__rpcSingleton__ = rpc;

// Cap the request body below Next's 1MB default, sized off the largest batches
// this app actually sends. Vault reads go through multicall with the lazy-oracle
// report call riding along, and the transport packs up to PROVIDER_MAX_BATCH
// multicalls per POST:
//   aggregate3(updateVaultData + ~1kb of reads)   ~12kb per eth_call
//   x PROVIDER_MAX_BATCH (20)                    ~238kb per POST
// 512kb keeps ~2.2x headroom — re-measure before lowering.
export const config = {
  api: {
    bodyParser: { sizeLimit: '512kb' },
  },
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.RPC),
  requestAddressMetric(Metrics.request.ethCallToAddress),
  defaultErrorHandler,
])(rpc);
