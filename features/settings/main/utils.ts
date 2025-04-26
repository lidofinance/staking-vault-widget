import {
  Address,
  encodeFunctionData,
  PublicClient,
  getContract,
  Hex,
} from 'viem';
import {
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_ROOT_ROLES_MAP,
} from 'modules/vaults/consts';
import {
  EditMainSettingsSchema,
  TxData,
  GrantOrRevokeRole,
  RoleFieldSchema,
} from './types';
import { dashboardAbi } from 'abi/dashboard-abi';
import { dashboardFunctionsNamesMap } from 'features/settings/main/consts';

export const prepareMainTxData = (data: EditMainSettingsSchema) => {
  const {
    confirmExpiry,
    defaultAdmins,
    nodeOperatorFeeBP,
    nodeOperatorManagers,
  } = data;
  const txData: TxData = {
    grantRoles: [],
    revokeRoles: [],
  };

  const roleProcessors = [
    { fields: defaultAdmins, role: VAULTS_ROOT_ROLES_MAP.defaultAdmin },
    {
      fields: nodeOperatorManagers,
      role: VAULTS_ROOT_ROLES_MAP.nodeOperatorManager,
    },
  ];

  roleProcessors.forEach(({ fields, role }) => {
    if (fields.length === 0) return;
    const [grantList, revokeList] = processRoleFields(fields, role);
    txData.grantRoles.push(...grantList);
    txData.revokeRoles.push(...revokeList);
  });

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

const processRoleFields = (
  fields: Array<RoleFieldSchema>,
  role: Hex,
): [GrantOrRevokeRole[], GrantOrRevokeRole[]] => {
  return fields.reduce(
    ([grant, revoke], field) => {
      const item = { account: field.value, role };
      field.state === 'grant' && grant.push(item);
      field.state === 'remove' && revoke.push(item);
      return [grant, revoke];
    },
    [[], []] as [GrantOrRevokeRole[], GrantOrRevokeRole[]],
  );
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
      abi: dashboardAbi,
      functionName,
      // @ts-expect-error find out how to setup right types
      args: [txData[key]],
    });

    const contract = getContract({
      address,
      abi: dashboardAbi,
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
