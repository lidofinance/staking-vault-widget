import type { Address } from 'viem';

import { getApiURL } from 'config';
import { standardFetcher } from 'utils/standardFetcher';
import { FetcherError } from 'utils/fetcherError';

import { vaultApiRoutes } from '../consts';

import type { VaultEntry } from './fetch-vaults';

export type VaultApiInfo = {
  address: Address;
  totalValue: bigint;
  // last oracle report values, kept off-chain so they survive disconnection
  lastReportTotalValueWei: bigint | null;
  isReportFresh: boolean;
  isDisconnected: boolean;
  updatedAt: Date | undefined;
};

type FetchVaultInfoParams = {
  vaultAddress: Address;
};

export const fetchVaultInfo = async ({
  vaultAddress,
}: FetchVaultInfoParams): Promise<VaultApiInfo> => {
  const apiURL = getApiURL('vaultsApiBasePath');
  if (!apiURL) {
    throw new Error('[fetchVaultInfo] API URL not found');
  }

  const data = await standardFetcher<VaultEntry>(
    vaultApiRoutes.vault(apiURL, vaultAddress),
  );

  return {
    address: data.address,
    totalValue: BigInt(data.totalValue ?? 0),
    lastReportTotalValueWei: data.lastReport?.totalValueWei
      ? BigInt(data.lastReport.totalValueWei)
      : null,
    isReportFresh: Boolean(data.isReportFresh),
    isDisconnected: Boolean(data.isDisconnected),
    updatedAt: data.updatedAt && new Date(data.updatedAt),
  };
};

const VAULT_NOT_FOUND_STATUSES = [400, 404];

/**
 * The API only stores vaults that have been connected to the VaultHub at least
 * once, so a "vault not found" response is what distinguishes a never-connected
 * vault from a voluntarily disconnected one.
 *
 * When the API itself is unreachable or not configured there is nothing to go
 * on, so the vault is reported as unknown and the caller falls back to its
 * on-chain heuristic.
 */
export const checkIsVaultKnownByApi = async ({
  vaultAddress,
}: FetchVaultInfoParams): Promise<boolean> => {
  try {
    await fetchVaultInfo({ vaultAddress });
    return true;
  } catch (error) {
    const isNotFound =
      error instanceof FetcherError &&
      VAULT_NOT_FOUND_STATUSES.includes(error.status);

    if (!isNotFound) {
      console.warn('[checkIsVaultKnownByApi] failed to fetch', error);
    }

    return false;
  }
};
