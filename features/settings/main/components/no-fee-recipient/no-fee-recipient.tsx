import { FC } from 'react';
import { useFormState } from 'react-hook-form';
import { Text } from '@lidofinance/lido-ui';

import { useVaultInfo, useVaultPermission, vaultTexts } from 'modules/vaults';
import { AddressBadge } from 'shared/components';

import { Skeleton } from 'features/settings/main/styles';

import { Wrapper } from './styles';
import { EditRecipient } from './edit-recipient';

const texts = vaultTexts.actions.settings.fields.nodeOperatorFeeRecipient;

export const NodeOperatorFeeRecipient: FC = () => {
  const { isLoading: isFormLoading } = useFormState();
  const { activeVault } = useVaultInfo();
  const { hasPermission, isLoading: isPermissionLoading } = useVaultPermission(
    'nodeOperatorManager',
  );
  const isLoading = isFormLoading || isPermissionLoading;

  return (
    <Wrapper>
      <Text size="xs" strong>
        {texts.title}
      </Text>
      {isLoading && <Skeleton />}
      {hasPermission && !isLoading ? (
        <EditRecipient />
      ) : (
        <AddressBadge
          weight={400}
          address={activeVault?.nodeOperatorFeeRecipient}
          symbols={21}
        />
      )}
    </Wrapper>
  );
};
