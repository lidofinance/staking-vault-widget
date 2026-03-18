import { FC } from 'react';
import { useFormState } from 'react-hook-form';
import { Text } from '@lidofinance/lido-ui';

import { useVaultPermission, vaultTexts } from 'modules/vaults';
import { AddressBadge } from 'shared/components';

import { Skeleton } from 'features/settings/main/styles';

import { Wrapper } from './styles';
import { EditRecipient } from './edit-recipient';
import { useMainSettingsData } from '../../contexts';

const texts = vaultTexts.actions.settings.fields.feeRecipient;

export const NodeOperatorFeeRecipient: FC = () => {
  const { data: mainSettingsData } = useMainSettingsData();
  const { isLoading: isFormLoading } = useFormState();
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
      {hasPermission && !isLoading && <EditRecipient />}
      {!hasPermission && !isLoading && (
        <AddressBadge
          weight={400}
          address={mainSettingsData?.feeRecipient}
          symbols={21}
          dataTestId="feeRecipient"
          showPopover
        />
      )}
    </Wrapper>
  );
};
