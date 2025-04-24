import { VaultFactoryArgs } from 'types';
import {
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_ALL_ROLES_MAP,
} from 'modules/vaults/consts';
import { CreateVaultSchema } from '../create-vault-form/create-vault-form-context/validation';
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
    defaultAdmin: values.defaultAdmin,
    nodeOperator: values.nodeOperator,
    nodeOperatorManager: values.nodeOperatorManager,
    nodeOperatorFeeBP: nodeOperatorFeeBPFormatted,
    confirmExpiry: confirmExpiryFormatted,

    roles: Object.entries(values.roles)
      .filter(([_, roleData]) => {
        return roleData.filter((item) => item.state === 'grant');
      })
      .flatMap(([roleName, roleData]) => {
        const roleHash = VAULTS_ALL_ROLES_MAP[roleName as PermissionKeys];
        invariant(
          roleHash,
          `[formatCreateVaultData] no role hash found for ${roleName}`,
        );
        if (!roleData) return [];
        return roleData.map((item) => ({
          role: roleHash,
          account: item.account,
        }));
      }),
  };
};
