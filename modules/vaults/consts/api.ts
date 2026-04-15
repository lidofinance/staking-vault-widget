import type { Address } from 'viem';

import { isNumber } from 'utils';

export type VaultsParams = {
  limit: number;
  offset: number;
  sortBy?: string;
  direction?: string;
  role?: string;
  address?: string;
};

export type ValidatorsParams = {
  limit?: number;
  offset?: number;
  orderBy?: string;
  direction?: string;
  status?: string;
  pubkey?: string;
  index?: number;
};

export const vaultApiRoutes = {
  vaults: (basePath: string, params: VaultsParams) => {
    const { limit, offset, sortBy, direction, role, address } = params;
    const queryParams = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      ...(sortBy && { sortBy }),
      ...(direction && { direction: direction.toUpperCase() }),
      ...(role && { role }),
      ...(address && { address }),
    });
    return `${basePath}/v1/vaults?${queryParams.toString()}`;
  },
  vaultMetrics: (basePath: string, vaultAddress: string) =>
    `${basePath}/v1/vaults/${vaultAddress}/latest-metrics`,
  vault7dApr: (basePath: string, vaultAddress: string) =>
    `${basePath}/v1/vaults/${vaultAddress}/apr/sma`,
  vaultReport: (basePath: string, vaultAddress: string, cid: string) =>
    `${basePath}/v1/report/${cid}/${vaultAddress}`,
};

export const validatorsApiRoutes = {
  validators: (
    basePath: string,
    vaultAddress: Address,
    params: ValidatorsParams,
  ) => {
    const { limit, offset, orderBy, direction, status, pubkey, index } = params;
    const url = new URL(`/v1/vaults/${vaultAddress}/validators`, basePath);

    Object.entries({ limit, offset, orderBy, direction, status, pubkey, index })
      .filter(([_, value]) => !!value || isNumber(value))
      .forEach(([key, value]) => url.searchParams.set(key, `${value}`));

    return url;
  },
};
