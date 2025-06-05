import { FC } from 'react';
import { useVaultInfo, vaultTexts } from 'modules/vaults';
import { useFormState } from 'react-hook-form';
import { Text } from '@lidofinance/lido-ui';

import { AddressBadge } from 'shared/components';
import { Skeleton } from 'features/settings/main/styles';

import { Wrapper } from './styles';

const texts = vaultTexts.actions.settings.fields.nodeOperator;

export const NodeOperator: FC = () => {
  const { isLoading } = useFormState();
  const { activeVault } = useVaultInfo();

  return (
    <Wrapper>
      <Text size="xs" strong>
        {texts.title}
      </Text>
      {isLoading ? (
        <Skeleton />
      ) : (
        <AddressBadge
          weight={400}
          address={activeVault?.nodeOperator}
          symbols={21}
        />
      )}
    </Wrapper>
  );
};
