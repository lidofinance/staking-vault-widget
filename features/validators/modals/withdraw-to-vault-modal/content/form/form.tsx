import { type FC, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Eth } from '@lidofinance/lido-ui';
import type { Hex } from 'viem';

import {
  FormController,
  TokenAmountInputGroup,
  useDisableForm,
} from 'shared/hook-form';
import { ConnectWalletButton } from 'shared/wallet';
import { useDappStatus } from 'modules/web3';
import { useVault, vaultTexts } from 'modules/vaults';

import { useValidators } from 'features/validators/contexts';
import {
  AvailableBalance,
  ModalFormButton,
  WarningInfo,
} from 'features/validators/shared';
import { MIN_ACTIVATION_BALANCE } from 'features/validators/const';

import { useWithdrawalToVault } from '../../hooks';
import { withdrawalFormResolver } from '../../validation';
import { VaultInJail } from '../../components';
import type {
  WithdrawalFormFieldValues,
  WithdrawalFormValidationContext,
  WithdrawalFormValidatedValues,
} from '../../types';

import { FormContainer, ActionContainer } from './styles';

type FormProps = {
  isPartial: boolean;
  availableToPartialWithdraw: bigint;
  pubkey: Hex;
};

const {
  estimatedFee,
  actionFull,
  actionPartial,
  actionDisabled,
  partialWarning,
  fullWarning,
  availableToWithdraw,
} = vaultTexts.actions.validators.modals.withdrawal;

export const WithdrawToVaultModalForm: FC<FormProps> = ({
  isPartial,
  pubkey,
  availableToPartialWithdraw,
}) => {
  const { invalidateVault } = useVault();
  const {
    hasWithdrawalPermission,
    getValidatorByPubkey,
    obligationsShortfallValue,
    validatorWithdrawalFee,
    isVaultInJail,
  } = useValidators();
  const disabled = useDisableForm();
  const { isDappActive } = useDappStatus();
  const { withdrawToVault, retryEvent } = useWithdrawalToVault();
  const { index, balance } = useMemo(
    () => getValidatorByPubkey(pubkey),
    [getValidatorByPubkey, pubkey],
  );

  const formObject = useForm<
    WithdrawalFormFieldValues,
    WithdrawalFormValidationContext,
    WithdrawalFormValidatedValues
  >({
    defaultValues: {
      amount: isPartial ? null : 0n,
      // `in_queue` validators have no index; the `z.number()` schema then keeps
      // the form invalid, which is the right outcome — they cannot be withdrawn
      index: index ?? undefined,
      pubkey,
      validatorWithdrawalFee,
      balance,
    },
    disabled:
      !isDappActive ||
      !hasWithdrawalPermission ||
      (isPartial && balance < MIN_ACTIVATION_BALANCE) ||
      (isPartial && isVaultInJail) ||
      disabled,
    resolver: withdrawalFormResolver,
    context: {
      availableAmount: isPartial ? availableToPartialWithdraw : balance,
      isPartial,
      obligationsShortfallValue,
    },
    mode: 'all',
  });

  const { reset, formState } = formObject;
  const actionAvailable = isPartial ? actionPartial : actionFull;
  const actionText = formState.disabled ? actionDisabled : actionAvailable;

  useEffect(() => {
    reset({
      amount: isPartial ? null : 0n,
      index: index ?? undefined,
      pubkey,
      validatorWithdrawalFee,
      balance,
    });
  }, [index, isPartial, pubkey, reset, validatorWithdrawalFee, balance]);

  const onSubmit = useCallback(
    async (formData: WithdrawalFormValidatedValues) => {
      const success = await withdrawToVault(formData);
      await invalidateVault();

      return success;
    },
    [invalidateVault, withdrawToVault],
  );

  return (
    <FormController
      formObject={formObject}
      onSubmit={onSubmit}
      retryEvent={retryEvent}
      afterSubmitResetOptions={false}
    >
      <FormContainer data-testid="withdrawal-form">
        {!formState.disabled && (
          <WarningInfo data-testid="warning">
            {isPartial ? partialWarning : fullWarning(balance)}
          </WarningInfo>
        )}
        {isPartial && (
          <>
            <AvailableBalance
              title={availableToWithdraw}
              amount={availableToPartialWithdraw}
              data-testid="available-balance"
            />
            <TokenAmountInputGroup
              amountFieldName="amount"
              label="ETH amount"
              leftDecorator={<Eth />}
              maxAmount={availableToPartialWithdraw}
              fullwidth
            />
            <VaultInJail isVaultInJail={isVaultInJail} />
          </>
        )}
        <ActionContainer>
          <AvailableBalance
            title={estimatedFee}
            amount={validatorWithdrawalFee}
            data-testid="estimated-fee"
          />
          <ConnectWalletButton>
            <ModalFormButton
              type="submit"
              disabled={formState.disabled}
              fullwidth
              data-testid="submit"
            >
              {actionText}
            </ModalFormButton>
          </ConnectWalletButton>
        </ActionContainer>
      </FormContainer>
    </FormController>
  );
};
