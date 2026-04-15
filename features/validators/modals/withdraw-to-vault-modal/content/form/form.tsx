import { type FC, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Eth, Text } from '@lidofinance/lido-ui';
import type { Hex } from 'viem';

import {
  FormController,
  TokenAmountInputGroup,
  useDisableForm,
} from 'shared/hook-form';
import { ConnectWalletButton } from 'shared/wallet';
import { FormatToken } from 'shared/formatters';
import { WEI_PER_ETHER } from 'consts/tx';
import { useDappStatus } from 'modules/web3';
import { useVault, vaultTexts } from 'modules/vaults';

import { useWithdrawalToVault } from '../../hooks';
import { withdrawalFormResolver } from '../../validation';
import type {
  WithdrawalFormFieldValues,
  WithdrawalFormValidationContext,
  WithdrawalFormValidatedValues,
} from '../../types';
import {
  ActionContainer,
  FeeContent,
} from '../../components/withdrawal-action/styles';

import { FormContainer } from './styles';

type FormProps = {
  balance: bigint;
  index: number;
  isPartial: boolean;
  pubkey: Hex;
};

const { estimatedFee, action } =
  vaultTexts.actions.validators.modals.withdrawal;

export const WithdrawToVaultModalForm: FC<FormProps> = ({
  balance,
  index,
  isPartial,
  pubkey,
}) => {
  const {
    invalidateVaultConfig,
    invalidateVaultState,
    refetch: refetchVault,
  } = useVault();
  const disabled = useDisableForm();
  const { isDappActive } = useDappStatus();
  const { withdrawToVault, retryEvent } = useWithdrawalToVault();

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
    disabled: !isDappActive || disabled,
    resolver: withdrawalFormResolver,
    context: { availableAmount: balance, isPartial },
    mode: 'all',
  });

  const { reset } = formObject;

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
            maxAmount={balance}
            fullwidth
          />
        )}
        <ActionContainer>
          <FeeContent>
            <Text size="xxs" color="secondary">
              {estimatedFee}
            </Text>
            <Text size="xxs">
              <FormatToken amount={WEI_PER_ETHER / 1000n} symbol="ETH" />
            </Text>
          </FeeContent>
          <ConnectWalletButton>
            <Button fullwidth>{action}</Button>
          </ConnectWalletButton>
        </ActionContainer>
      </FormContainer>
    </FormController>
  );
};
