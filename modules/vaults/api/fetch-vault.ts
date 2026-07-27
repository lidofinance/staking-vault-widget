import type { Address } from 'viem';

import { getApiURL } from 'config';
import { vaultApiRoutes } from '../consts';

export type VaultApiInfo = {
  address: Address;
  totalValue: bigint;
  // last oracle report values, kept off-chain so they survive disconnection
  lastReportTotalValueWei: bigint | null;
  isReportFresh: boolean;
  updatedAt: Date;
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

  const res = await fetch(vaultApiRoutes.vault(apiURL, vaultAddress));

  if (!res.ok) {
    throw new Error(`Error fetching vault info: ${res.statusText}`);
  }

  const data = await res.json();

  return {
    address: data.address as Address,
    totalValue: BigInt(data.totalValue),
    lastReportTotalValueWei: data.lastReport?.totalValueWei
      ? BigInt(data.lastReport.totalValueWei)
      : null,
    isReportFresh: Boolean(data.isReportFresh),
    updatedAt: new Date(data.updatedAt),
  };
};
