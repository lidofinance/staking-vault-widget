import { Address } from 'viem';

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
  vaultAddress: Address;
};

export const fetchVault7dApr = async (
  vaultAddress: Address,
): Promise<Vault7DApr> => {
  const apiURL = getApiURL('vaultsApiBasePath');
  if (!apiURL) {
    throw new Error('[fetchVault7dApr] API URL not found');
  }

  const res = await fetch(vaultApiRoutes.vault7dApr(apiURL, vaultAddress));

  if (!res.ok) {
    throw new Error(
      `[fetchVault7dApr] Error fetching vault 7d APR: ${res.statusText}`,
    );
  }

  return await res.json();
};

export const fetch7dApr = async ({
  vaultAddress,
}: FetchVaultMetricsParams): Promise<Vault7DApr | null> => {
  try {
    return await fetchVault7dApr(vaultAddress);
  } catch (error) {
    console.warn('[fetch7dApr] Error fetching 7 days APR from api:', error);

    return null;
  }
};
