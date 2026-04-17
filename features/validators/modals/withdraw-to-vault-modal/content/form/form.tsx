import { type FC, useCallback, useEffect } from 'react';
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
import { AvailableBalance, ModalFormButton } from 'features/validators/shared';

import { useWithdrawalToVault } from '../../hooks';
import { withdrawalFormResolver } from '../../validation';
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

const { estimatedFee, actionFull, actionPartial, actionDisabled } =
  vaultTexts.actions.validators.modals.withdrawal;

export const WithdrawToVaultModalForm: FC<FormProps> = ({
  isPartial,
  pubkey,
  availableToPartialWithdraw,
}) => {
  const {
    invalidateVaultConfig,
    invalidateVaultState,
    refetch: refetchVault,
  } = useVault();
  const {
    hasWithdrawalPermission,
    isVaultInJail,
    getValidatorByPubkey,
    obligationsShortfallValue,
    validatorWithdrawalFee,
  } = useValidators();
  const disabled = useDisableForm();
  const { isDappActive } = useDappStatus();
  const { withdrawToVault, retryEvent } = useWithdrawalToVault();
  const { index, balance } = getValidatorByPubkey(pubkey);

  const formObject = useForm<
    WithdrawalFormFieldValues,
    WithdrawalFormValidationContext,
    WithdrawalFormValidatedValues
  >({
    defaultValues: {
      amount: isPartial ? null : 0n,
      index,
      pubkey,
    },
    disabled:
      !isDappActive ||
      !hasWithdrawalPermission ||
      disabled ||
      (isPartial && isVaultInJail) ||
      (isPartial && obligationsShortfallValue > 0n),
    resolver: withdrawalFormResolver,
    context: { availableAmount: balance, isPartial },
    mode: 'all',
  });

  const { reset, formState } = formObject;
  const actionAvailable = isPartial ? actionPartial : actionFull;
  const actionText = formState.disabled ? actionDisabled : actionAvailable;

  useEffect(() => {
    reset({
      amount: isPartial ? null : 0n,
      index,
      pubkey,
    });
  }, [index, isPartial, pubkey, reset]);

  const onSubmit = useCallback(
    async (formData: WithdrawalFormValidatedValues) => {
      const success = await withdrawToVault(formData);
      await Promise.all([
        invalidateVaultConfig(),
        invalidateVaultState(),
        refetchVault(),
      ]);

      return success;
    },
    [
      invalidateVaultConfig,
      invalidateVaultState,
      refetchVault,
      withdrawToVault,
    ],
  );

  return (
    <FormController
      formObject={formObject}
      onSubmit={onSubmit}
      retryEvent={retryEvent}
      afterSubmitResetOptions={false}
    >
      <FormContainer>
        {isPartial && (
          <TokenAmountInputGroup
            amountFieldName="amount"
            label="ETH amount"
            leftDecorator={<Eth />}
            maxAmount={availableToPartialWithdraw}
            fullwidth
          />
        )}
        <ActionContainer>
          <AvailableBalance
            title={estimatedFee}
            amount={validatorWithdrawalFee}
          />
          <ConnectWalletButton>
            <ModalFormButton
              type="submit"
              disabled={formState.disabled}
              fullwidth
            >
              {actionText}
            </ModalFormButton>
          </ConnectWalletButton>
        </ActionContainer>
      </FormContainer>
    </FormController>
  );
};
