import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAccount } from 'wagmi';

import {
  useVaultConfirmingRoles,
  MultiplePermissionedSubmitButton,
  useVault,
  useVaultPermission,
} from 'modules/vaults';

import { ButtonStyled } from './styles';
import { useVaultTierInfo } from '../../hooks';

export const TierFormAction = () => {
  const {
    watch,
    formState: { isDirty, isSubmitting, isValid, defaultValues },
  } = useFormContext();
  const { hasConfirmingRole, hasAdmin, hasNodeOperatorManager } =
    useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('tierChangeRequester');

  const { data: vaultTierInfo } = useVaultTierInfo();
  const [selectedTierId, vaultMintingLimit] = watch([
    'selectedTierId',
    'vaultMintingLimit',
  ]);
  const { address } = useAccount();
  const { activeVault } = useVault();

  const buttonText = useMemo(() => {
    if (!defaultValues || !isDirty) {
      return 'Your current tier';
    }

    if (selectedTierId !== defaultValues.selectedTierId) {
      return `Request Tier ${selectedTierId.toString()}`;
    }

    if (vaultMintingLimit !== defaultValues.vaultMintingLimit) {
      return `Request new minting limit`;
    }

    return 'Your current tier';
  }, [selectedTierId, vaultMintingLimit, defaultValues, isDirty]);

  const showButton =
    (hasConfirmingRole ||
      hasAdmin ||
      hasNodeOperatorManager ||
      hasPermission ||
      activeVault?.nodeOperator === address) &&
    selectedTierId &&
    vaultTierInfo?.tier.id !== BigInt(selectedTierId);
  const buttonDisabled = !isDirty || isSubmitting || !isValid;

  if (!showButton) {
    return null;
  }

  const isNodeOperator = activeVault?.nodeOperator === address;

  if (isNodeOperator) {
    return (
      <ButtonStyled disabled={buttonDisabled} type="submit">
        {buttonText}
      </ButtonStyled>
    );
  }

  return (
    <MultiplePermissionedSubmitButton
      disabled={buttonDisabled}
      dashboardRoles={['tierChangeRequester']}
    >
      {buttonText}
    </MultiplePermissionedSubmitButton>
  );
};
