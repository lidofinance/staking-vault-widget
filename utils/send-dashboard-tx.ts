import { TxData } from '../features/settings/main/types';
import { Address, getContract, Hash, PublicClient, WalletClient } from 'viem';
import { dashboardAbi } from 'abi/dashboard-abi';
import { MutableRefObject } from 'react';

export const dashboardFunctionsNamesMap: Record<
  keyof TxData,
  'grantRoles' | 'setConfirmExpiry' | 'setNodeOperatorFeeBP'
> = {
  roles: 'grantRoles',
  confirmExpiry: 'setConfirmExpiry',
  nodeOperatorFeeBP: 'setNodeOperatorFeeBP',
};

export const sendDashboardTx = async ({
  txData,
  contractAddress,
  publicClient,
  walletClient,
  abortControllerRef,
}: {
  txData: TxData;
  contractAddress: Address;
  publicClient: PublicClient;
  walletClient: WalletClient;
  abortControllerRef: MutableRefObject<AbortController>;
}) => {
  const keys = Object.keys(txData) as (keyof TxData)[];
  const contract = getContract({
    address: contractAddress,
    abi: dashboardAbi,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });

  const responses: { tx: Hash; key: keyof TxData }[] = [];
  for (const key of keys) {
    const {
      current: { signal },
    } = abortControllerRef;
    if (signal.aborted) {
      return responses;
    }

    const functionName = dashboardFunctionsNamesMap[key];

    // @ts-expect-error find out how to setup right types
    const tx = await contract.write[functionName]({
      address: contractAddress,
      abi: dashboardAbi,
      args: [txData[key]],
    });

    responses.push({ tx, key });
  }

  return responses;
};
