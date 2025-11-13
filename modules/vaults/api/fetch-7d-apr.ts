import { getApiURL } from 'config';
import { vaultApiRoutes } from '../consts';

export type TimestampRange = {
  fromTimestamp: number;
  toTimestamp: number;
};

export type ReportMeta = {
  reportCid: string;
  timestamp: number;
};

export type Apr7dSeries = {
  sma: number;
  aprs: number[];
};

export type Vault7DApr = {
  days: number;
  count: number;
  range: TimestampRange;
  meta: ReportMeta[];
  grossStakingApr: Apr7dSeries;
  netStakingApr: Apr7dSeries;
  carrySpreadApr: Apr7dSeries;
};

type FetchVaultMetricsParams = {
  vaultAddress: string;
};

export const fetch7dApr = async ({
  vaultAddress,
}: FetchVaultMetricsParams): Promise<Vault7DApr> => {
  const apiURL = getApiURL('vaultsApiBasePath');
  if (!apiURL) {
    throw new Error('[fetchVaultMetrics] API URL not found');
  }

  const res = await fetch(vaultApiRoutes.vault7dApr(apiURL, vaultAddress));

  if (!res.ok) {
    throw new Error(`Error fetching vault 7d APR: ${res.statusText}`);
  }

  return await res.json();
};
