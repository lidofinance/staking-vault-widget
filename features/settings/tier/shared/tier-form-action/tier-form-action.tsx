import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  useVaultConfirmingRoles,
  MultiplePermissionedSubmitButton,
  useVaultPermission,
  useVaultTierInfo,
  VAULTS_ALL_ROLES,
} from 'modules/vaults';

import { ButtonStyled } from './styles';

const configurationRoles = [
  'vaultConfiguration',
] as readonly VAULTS_ALL_ROLES[];

export const TierFormAction = () => {
  const {
    watch,
    formState: { isDirty, isSubmitting, isValid, defaultValues, disabled },
  } = useFormContext();
  const {
    hasConfirmingRole,
    hasAdmin,
    hasNodeOperatorManager,
    isNodeOperator,
  } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('vaultConfiguration');

  const { data: vaultTierInfo } = useVaultTierInfo();
  const [selectedTierId, vaultMintingLimit] = watch([
    'selectedTierId',
    'vaultMintingLimit',
  ]);

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
      isNodeOperator) &&
    !disabled &&
    selectedTierId &&
    vaultTierInfo?.tier.id !== BigInt(selectedTierId);
  const buttonDisabled = !isDirty || isSubmitting || !isValid;

  if (!showButton) {
    return null;
  }

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
      dashboardRoles={configurationRoles}
    >
      {buttonText}
    </MultiplePermissionedSubmitButton>
  );
};
