import { Address, encodeFunctionData, PublicClient, getContract } from 'viem';
import { DEFAULT_ADMIN_ROLE, NODE_OPERATOR_MANAGER_ROLE } from 'consts/roles';
import { VAULT_TOTAL_BASIS_POINTS } from 'modules/vaults/consts';
import { EditMainSettingsSchema, TxData } from './types';
import { DelegationAbi } from 'abi/delegation';
import { dashboardFunctionsNamesMap } from 'utils/send-dashboard-tx';

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
    const functionName = dashboardFunctionsNamesMap[key];
    const data = encodeFunctionData({
      abi: DelegationAbi,
      functionName,
      // @ts-expect-error find out how to setup right types
      args: [txData[key]],
    });

    const contract = getContract({
      address,
      abi: DelegationAbi,
      client: {
        public: publicClient,
      },
    });

    // @ts-expect-error types
    const gas = await contract.estimateGas[functionName]([txData[key]]);

    return {
      to: address,
      from: account,
      gas,
      data,
    };
  });

  return await Promise.all(aaPayload);
};
