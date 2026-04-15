import { type FC, useCallback, useMemo } from 'react';
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
import { ValidatorPdgStage } from 'features/validators/shared';

import { useSubmitTopup } from '../../hooks';
import { topUpFormResolver } from '../../validation';
import type {
  TopUpFormFieldValues,
  TopUpFormValidationContext,
  TopUpFormValidatedValues,
} from '../../types';

import { FormContainer } from './styles';

type FormProps = {
  pubkey: Hex;
};

const { action } = vaultTexts.actions.validators.modals.topUp;

export const TopupModalForm: FC<FormProps> = ({ pubkey }) => {
  const {
    invalidateVaultConfig,
    invalidateVaultState,
    refetch: refetchVault,
  } = useVault();
  const disabled = useDisableForm();
  const {
    hasDepositorPermission,
    beaconChainDepositsPaused,
    availableBalance,
    getValidatorByPubkey,
  } = useValidators();
  const { isDappActive } = useDappStatus();
  const { topUp, retryEvent } = useSubmitTopup();
  const { index, pdgStage } = useMemo(
    () => getValidatorByPubkey(pubkey),
    [getValidatorByPubkey, pubkey],
  );

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
    disabled:
      !isDappActive ||
      disabled ||
      !hasDepositorPermission ||
      pdgStage !== ValidatorPdgStage.ACTIVATED ||
      beaconChainDepositsPaused,
    resolver: topUpFormResolver,
    context: { availableBalance },
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
          maxAmount={availableBalance}
          fullwidth
        />
        <ConnectWalletButton>
          <Button disabled={formObject.formState.disabled} fullwidth>
            {action}
          </Button>
        </ConnectWalletButton>
      </FormContainer>
    </FormController>
  );
};
