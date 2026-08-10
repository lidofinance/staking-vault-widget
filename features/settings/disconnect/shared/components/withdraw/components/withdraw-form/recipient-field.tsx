import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Text, useBreakpoint } from '@lidofinance/lido-ui';
import type { Address } from 'viem';

import { vaultTexts } from 'modules/vaults';
import { AddressBadge } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls';

import { IdenticonDecorator } from './identicon-decorator';
import { AddressToggle, RecipientContainer, Wrapper } from './styles';
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

  const handleToggle = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setValue('recipient', vaultOwner, {
        shouldValidate: target.checked,
      });
    },
    [setValue, vaultOwner],
  );

  return (
    <Wrapper>
      <RecipientContainer>
        <Text size="xs" strong>
          {texts.recipientLabel}
        </Text>
        <AddressToggle
          fieldName="useOwnerAddress"
          onChange={handleToggle}
          label={
            useOwnerAddress ? texts.useAnotherAddress : texts.useOwnerAddress
          }
          data-testid="disconnectWithdrawAddressToggle"
        />
      </RecipientContainer>
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
    </Wrapper>
  );
};
