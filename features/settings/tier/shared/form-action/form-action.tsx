import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useVaultConfirmingRoles } from 'modules/vaults';

import { ButtonStyled } from './styles';

export const FormAction = () => {
  const {
    watch,
    formState: { isDirty, isSubmitting, isValid, defaultValues },
  } = useFormContext();
  const { hasConfirmingRole, hasAdmin, hasNodeOperatorManager } =
    useVaultConfirmingRoles();
  const [selectedTierId, vaultMintingLimit] = watch([
    'selectedTierId',
    'vaultMintingLimit',
  ]);

  const buttonText = useMemo(() => {
    if (!defaultValues || !isDirty) {
      return 'Your current tier';
    }

    if (selectedTierId !== defaultValues.selectedTierId) {
      // TODO: check text
      `You selected Tier ${selectedTierId.toString()}`;
    }

    if (vaultMintingLimit !== defaultValues.vaultMintingLimit) {
      // TODO: check text
      `Increase tier limit`;
    }

    return 'Your current tier';
  }, [selectedTierId, vaultMintingLimit, defaultValues, isDirty]);

  const showButton = hasConfirmingRole || hasAdmin || hasNodeOperatorManager;
  const buttonDisabled = !isDirty || isSubmitting || !isValid;

  if (!showButton) {
    return null;
  }

  return <ButtonStyled disabled={buttonDisabled}>{buttonText}</ButtonStyled>;
};
