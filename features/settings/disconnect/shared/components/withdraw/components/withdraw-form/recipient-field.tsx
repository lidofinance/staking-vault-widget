import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Text, useBreakpoint } from '@lidofinance/lido-ui';
import type { Address } from 'viem';

import { vaultTexts } from 'modules/vaults';
import { AddressBadge } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls';

import { IdenticonDecorator } from './identicon-decorator';
import { AddressToggle, Wrapper } from './styles';
import type { DisconnectWithdrawFormFieldValues } from './types';

const texts = vaultTexts.actions.disconnectVault.withdraw;

type RecipientFieldProps = {
  vaultOwner: Address;
};

export const RecipientField = ({ vaultOwner }: RecipientFieldProps) => {
  const { setValue } = useFormContext<DisconnectWithdrawFormFieldValues>();
  const isMobile = useBreakpoint('md');

  const useOwnerAddress = useWatch<
    DisconnectWithdrawFormFieldValues,
    'useOwnerAddress'
  >({ name: 'useOwnerAddress' });

  // switching back to the owner restores its address, switching away clears the
  // field so the user starts from an empty input
  const handleToggle = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setValue('recipient', target.checked ? vaultOwner : '', {
        shouldValidate: target.checked,
      });
    },
    [setValue, vaultOwner],
  );

  return (
    <Wrapper>
      <Text size="xs" strong>
        {texts.recipientLabel}
      </Text>
      {useOwnerAddress ? (
        <AddressBadge
          address={vaultOwner}
          symbols={isMobile ? 9 : 21}
          showPopover
          dataTestId="disconnectWithdrawRecipientBadge"
        />
      ) : (
        <AddressInputHookForm
          fieldName="recipient"
          showRightDecorator={false}
          leftDecorator={<IdenticonDecorator />}
          data-testid="disconnectWithdrawRecipientInput"
        />
      )}
      <AddressToggle
        fieldName="useOwnerAddress"
        onChange={handleToggle}
        label={
          useOwnerAddress ? texts.useAnotherAddress : texts.useOwnerAddress
        }
        data-testid="disconnectWithdrawAddressToggle"
      />
    </Wrapper>
  );
};
