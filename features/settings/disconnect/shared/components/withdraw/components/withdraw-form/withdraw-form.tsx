import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { Address } from 'viem';

import { useVault, vaultTexts } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';

import { useWithdrawBalance, useWithdrawData } from '../../hooks';

import { RecipientField } from './recipient-field';
import { FormControllerStyled } from './styles';
import { disconnectWithdrawFormResolver } from './validation';
import type {
  DisconnectWithdrawFormFieldValues,
  DisconnectWithdrawFormValidatedValues,
} from './types';

const texts = vaultTexts.actions.disconnectVault.withdraw;

type WithdrawFormContentProps = {
  vaultAddress: Address;
  vaultOwner: Address;
};

const WithdrawFormContent = ({
  vaultAddress,
  vaultOwner,
}: WithdrawFormContentProps) => {
  const { isDappActive } = useDappStatus();
  const { availableBalance, isAvailableBalanceLoading } = useWithdrawData();
  const {
    withdrawBalance,
    retryEvent,
    mutation: { isPending },
  } = useWithdrawBalance();

  const resolver = useMemo(
    () => disconnectWithdrawFormResolver(vaultAddress),
    [vaultAddress],
  );

  const formObject = useForm<
    DisconnectWithdrawFormFieldValues,
    unknown,
    DisconnectWithdrawFormValidatedValues
  >({
    defaultValues: {
      useOwnerAddress: true,
      recipient: vaultOwner,
    },
    mode: 'all',
    // NOT useDisableForm(): it disables the form while the vault is
    // disconnected, which is exactly the state this step runs in
    disabled: !isDappActive,
    resolver,
  });

  const onSubmit = useCallback(
    ({ recipient }: DisconnectWithdrawFormValidatedValues) =>
      withdrawBalance({ recipient, amount: availableBalance }),
    [availableBalance, withdrawBalance],
  );

  return (
    <FormControllerStyled
      formObject={formObject}
      onSubmit={onSubmit}
      retryEvent={retryEvent}
      data-testid="disconnectWithdrawForm"
    >
      <RecipientField vaultOwner={vaultOwner} />
      <SubmitButtonHookForm
        disabled={isAvailableBalanceLoading || availableBalance === 0n}
        loading={isPending}
        size="sm"
        style={{ width: 'fit-content' }}
        data-testid="disconnectWithdrawSubmit"
      >
        {texts.submit(availableBalance)}
      </SubmitButtonHookForm>
    </FormControllerStyled>
  );
};

export const WithdrawForm = () => {
  const { activeVault } = useVault();
  const { availableBalance } = useWithdrawData();

  if (!activeVault || availableBalance === 0n) return null;

  return (
    <WithdrawFormContent
      key={activeVault.vaultOwner}
      vaultAddress={activeVault.address}
      vaultOwner={activeVault.vaultOwner}
    />
  );
};
