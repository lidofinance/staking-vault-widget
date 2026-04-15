import { type FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Eth } from '@lidofinance/lido-ui';
import type { Hex } from 'viem';

import {
  FormController,
  TokenAmountInputGroup,
  useDisableForm,
} from 'shared/hook-form';
import { useDappStatus } from 'modules/web3';
import { useVault, vaultTexts } from 'modules/vaults';
import { ConnectWalletButton } from 'shared/wallet';

import { useValidators } from 'features/validators/contexts';

import { useSubmitTopup } from '../../hooks';
import { topUpFormResolver } from '../../validation';
import type {
  TopUpFormFieldValues,
  TopUpFormValidationContext,
  TopUpFormValidatedValues,
} from '../../types';

import { FormContainer } from './styles';

type FormProps = {
  balance: bigint;
  index: number;
  pubkey: Hex;
};

const { action } = vaultTexts.actions.validators.modals.topUp;

export const TopupModalForm: FC<FormProps> = ({ balance, index, pubkey }) => {
  const {
    invalidateVaultConfig,
    invalidateVaultState,
    refetch: refetchVault,
  } = useVault();
  // TODO: check if deposits paused
  const disabled = useDisableForm();
  const { hasDepositorPermission } = useValidators();
  const { isDappActive } = useDappStatus();
  const { topUp, retryEvent } = useSubmitTopup();

  const formObject = useForm<
    TopUpFormFieldValues,
    TopUpFormValidationContext,
    TopUpFormValidatedValues
  >({
    defaultValues: {
      amount: null,
      index,
      pubkey,
    },
    disabled: !isDappActive || disabled || !hasDepositorPermission,
    resolver: topUpFormResolver,
    context: { availableBalance: balance },
    mode: 'all',
  });

  const onSubmit = useCallback(
    async (formData: TopUpFormValidatedValues) => {
      const success = await topUp(formData);
      await Promise.all([
        invalidateVaultConfig(),
        invalidateVaultState(),
        refetchVault(),
      ]);

      return success;
    },
    [invalidateVaultConfig, invalidateVaultState, topUp, refetchVault],
  );

  return (
    <FormController
      formObject={formObject}
      onSubmit={onSubmit}
      retryEvent={retryEvent}
      afterSubmitResetOptions={false}
    >
      <FormContainer>
        <TokenAmountInputGroup
          amountFieldName="amount"
          label="ETH amount"
          leftDecorator={<Eth />}
          maxAmount={balance}
          fullwidth
        />
        {/*TODO: use button with connect option*/}
        <ConnectWalletButton>
          <Button disabled={formObject.formState.disabled} fullwidth>
            {action}
          </Button>
        </ConnectWalletButton>
      </FormContainer>
    </FormController>
  );
};
