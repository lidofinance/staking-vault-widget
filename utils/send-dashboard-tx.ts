import { TxData } from '../features/settings/main/types';
import { Address, getContract, PublicClient, WalletClient } from 'viem';
import { dashboardAbi } from 'abi/dashboard-abi';

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
}: {
  txData: TxData;
  contractAddress: Address;
  publicClient: PublicClient;
  walletClient: WalletClient;
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

  const data = keys.map(async (key) => {
    const functionName = dashboardFunctionsNamesMap[key];

    // @ts-expect-error find out how to setup right types
    const tx = await contract.write[functionName]({
      address: contractAddress,
      abi: dashboardAbi,
      args: [txData[key]],
    });

    return { tx, key };
  });

  return await Promise.all(data);
};
