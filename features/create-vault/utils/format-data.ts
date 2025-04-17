import { VaultFactoryArgs } from '../../../types';
import { VAULT_TOTAL_BASIS_POINTS } from 'consts/vault-hub';
import { CreateVaultSchema } from '../create-vault-form/create-vault-form-context/validation';

export const formatCreateVaultData = (
  values: CreateVaultSchema,
): VaultFactoryArgs => {
  const { nodeOperator, ...payload } = values;
  const { confirmExpiry, nodeOperatorFeeBP } = payload;
  const confirmExpiryFormatted = BigInt(confirmExpiry * 60 * 60);
  const nodeOperatorFeeBPFormatted =
    (nodeOperatorFeeBP * VAULT_TOTAL_BASIS_POINTS) / 100;

  return {
    ...payload,
    confirmExpiry: confirmExpiryFormatted,
    nodeOperatorFeeBP: nodeOperatorFeeBPFormatted,
  } as VaultFactoryArgs;
};
