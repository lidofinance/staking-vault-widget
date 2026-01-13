import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  useVaultConfirmingRoles,
  MultiplePermissionedSubmitButton,
  useVaultPermission,
  VAULTS_ALL_ROLES,
} from 'modules/vaults';

import { ButtonStyled } from './styles';

const configurationRoles = [
  'vaultConfiguration',
] as readonly VAULTS_ALL_ROLES[];

export const TierFormAction = () => {
  const {
    watch,
    formState: {
      isDirty,
      isSubmitting,
      isValid,
      defaultValues,
      disabled,
      isLoading,
    },
  } = useFormContext();
  const {
    hasConfirmingRole,
    hasAdmin,
    hasNodeOperatorManager,
    isNodeOperator,
  } = useVaultConfirmingRoles();
  const { hasPermission: hasVaultConfigurationPermission } =
    useVaultPermission('vaultConfiguration');

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
      hasVaultConfigurationPermission ||
      isNodeOperator) &&
    !disabled;
  const buttonDisabled = !isDirty || isSubmitting || !isValid;

  if (!showButton || isLoading) {
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
