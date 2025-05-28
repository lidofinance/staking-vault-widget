import { FC } from 'react';

import { InlineLoader, Text } from '@lidofinance/lido-ui';
import { AddressBadge } from 'shared/components';

import { Wrapper } from './styles';

import { useVaultInfo, vaultTexts } from 'modules/vaults';
import { useFormState } from 'react-hook-form';

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
        <InlineLoader />
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
