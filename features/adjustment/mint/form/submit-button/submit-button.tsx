import { useVaultInfo, type VAULT_OWNER_ROLES } from 'modules/vaults';
import {
  MultiplePermissionedSubmitButton,
  OracleReportButton,
} from 'modules/vaults/components';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const NON_INCREASE_LOCK_ROLES = ['minter'] as VAULT_OWNER_ROLES[];
const INCREASE_LOCK_ROLES = ['minter', 'locker'] as VAULT_OWNER_ROLES[];

export const SubmitButton = () => {
  const {
    formState: { isSubmitting, isValid },
  } = useFormContext();

  const { activeVault } = useVaultInfo();

  const [amount, token] = useWatch<{
    amount?: bigint;
    token: 'stETH' | 'wstETH';
  }>({
    name: ['amount', 'token'],
  });

  // TODO: move this check to upper context
  const roles: VAULT_OWNER_ROLES[] = useMemo(() => {
    if (!activeVault || !amount) return NON_INCREASE_LOCK_ROLES;
    const isSteth = token === 'stETH';
    const locked = isSteth ? activeVault.locked : activeVault.lockedShares;
    const newMinted =
      (amount as bigint) +
      (isSteth ? activeVault.liabilityStETH : activeVault.liabilityShares);

    if (newMinted > locked) {
      return INCREASE_LOCK_ROLES;
    }
    return NON_INCREASE_LOCK_ROLES;
  }, [activeVault, amount, token]);

  const disabled = isSubmitting && !isValid;

  return (
    <OracleReportButton>
      <MultiplePermissionedSubmitButton
        dashboardRoles={roles}
        type="submit"
        disabled={disabled}
      >
        Mint
      </MultiplePermissionedSubmitButton>
    </OracleReportButton>
  );
};
