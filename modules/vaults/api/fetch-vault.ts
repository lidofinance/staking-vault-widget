import type { Address } from 'viem';

import { getApiURL } from 'config';
import { standardFetcher } from 'utils/standardFetcher';

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
