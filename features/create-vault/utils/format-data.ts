import { VaultFactoryArgs } from 'types';
import {
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_ALL_ROLES_MAP,
} from 'modules/vaults/consts';
import { CreateVaultSchema } from '../create-vault-form/create-vault-form-context/validation';
import { Address } from 'viem';
import { PermissionKeys } from '../types';
import invariant from 'tiny-invariant';

export const formatCreateVaultData = (
  values: CreateVaultSchema,
): VaultFactoryArgs => {
  const { confirmExpiry, nodeOperatorFeeBP } = values;
  const confirmExpiryFormatted = BigInt(confirmExpiry * 60 * 60);
  const nodeOperatorFeeBPFormatted = BigInt(
    (nodeOperatorFeeBP * VAULT_TOTAL_BASIS_POINTS) / 100,
  );
  return {
    defaultAdmin: values.defaultAdmin as Address,
    nodeOperator: values.nodeOperator as Address,
    nodeOperatorManager: values.nodeOperatorManager as Address,
    nodeOperatorFeeBP: nodeOperatorFeeBPFormatted,
    confirmExpiry: confirmExpiryFormatted,

    roles: Object.entries(values.roles).flatMap(([roleName, roleAddresses]) => {
      const roleHash = VAULTS_ALL_ROLES_MAP[roleName as PermissionKeys];
      invariant(
        roleHash,
        `[formatCreateVaultData] no role hash found for ${roleName}`,
      );
      if (!roleAddresses) return [];
      return roleAddresses.map((address) => ({
        role: roleHash,
        account: address as Address,
      }));
    }),
  };
};
