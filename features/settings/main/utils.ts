import {
  Address,
  encodeFunctionData,
  PublicClient,
  getContract,
  WalletClient,
} from 'viem';
import { DEFAULT_ADMIN_ROLE, NODE_OPERATOR_MANAGER_ROLE } from 'consts/roles';
import { VAULT_TOTAL_BASIS_POINTS } from 'consts/vault-hub';
import { EditMainSettingsSchema, TxData } from './types';
import { DelegationAbi } from 'abi/delegation';
import { fnNamesMap } from './consts';

export const prepareMainTxData = (data: EditMainSettingsSchema) => {
  const {
    confirmExpiry,
    defaultAdmin,
    nodeOperatorFeeBP,
    nodeOperatorManager,
  } = data;
  const txData: TxData = {};

  if (defaultAdmin.length > 0) {
    const adminsList = (defaultAdmin as { value: Address }[]).map(
      ({ value }) => ({
        account: value,
        role: DEFAULT_ADMIN_ROLE,
      }),
    );

    txData.roles = adminsList;
  }

  if (nodeOperatorManager.length > 0) {
    const noManagersList = (nodeOperatorManager as { value: Address }[]).map(
      ({ value }) => ({
        account: value,
        role: NODE_OPERATOR_MANAGER_ROLE,
      }),
    );

    if (txData.roles) {
      txData.roles.push(...noManagersList);
    } else {
      txData.roles = noManagersList;
    }
  }

  if (confirmExpiry.length > 0) {
    txData.confirmExpiry = BigInt(confirmExpiry[0].value * 60 * 60); // in seconds
  }

  if (nodeOperatorFeeBP.length > 0) {
    txData.nodeOperatorFeeBP = BigInt(
      (nodeOperatorFeeBP[0].value * VAULT_TOTAL_BASIS_POINTS) / 100,
    );
  }

  return txData;
};

export const generateMainAATxData = async ({
  txData,
  address,
  account,
  publicClient,
}: {
  txData: TxData;
  address: Address;
  account: Address;
  publicClient: PublicClient;
}) => {
  const keys = Object.keys(txData) as (keyof TxData)[];

  const aaPayload = keys.map(async (key) => {
    const functionName = fnNamesMap[key];
    const data = encodeFunctionData({
      abi: DelegationAbi,
      functionName,
      // @ts-expect-error find out how to setup right types
      args: [txData[key]],
    });

    const gas = await publicClient.estimateContractGas({
      address,
      abi: DelegationAbi,
      functionName,
      account,
      // @ts-expect-error find out how to setup right types
      args: [txData[key]],
    });

    return {
      to: address,
      from: account,
      gas,
      data,
    };
  });

  return await Promise.all(aaPayload);
};

export const sendTransactions = async ({
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
    abi: DelegationAbi,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });

  const data = keys.map(async (key) => {
    const functionName = fnNamesMap[key];

    // @ts-expect-error find out how to setup right types
    const tx = await contract.write[functionName]({
      address: contractAddress,
      abi: DelegationAbi,
      args: [txData[key]],
    });

    return { tx, key };
  });

  return await Promise.all(data);
};
