import { VaultFactoryArgs } from 'types';
import { VAULT_TOTAL_BASIS_POINTS } from 'modules/vaults/consts';
import { CreateVaultSchema } from '../create-vault-form/create-vault-form-context/validation';

export const formatCreateVaultData = (
  values: CreateVaultSchema,
): VaultFactoryArgs => {
  const { nodeOperator, ...payload } = values;
  const { confirmExpiry, nodeOperatorFeeBP } = payload;
  const confirmExpiryFormatted = BigInt(confirmExpiry * 60 * 60);
  const nodeOperatorFeeBPFormatted = BigInt(
    (nodeOperatorFeeBP * VAULT_TOTAL_BASIS_POINTS) / 100,
  );

  return {
    ...payload,
    confirmExpiry: confirmExpiryFormatted,
    nodeOperatorFeeBP: nodeOperatorFeeBPFormatted,
  } as VaultFactoryArgs;
};
