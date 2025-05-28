import { FC } from 'react';

import { Text } from '@lidofinance/lido-ui';
import { AddressBadge } from 'shared/components';

import { Wrapper } from './styles';

import { useVaultInfo, vaultTexts } from 'modules/vaults';

const texts = vaultTexts.actions.settings.fields.nodeOperator;

export const NodeOperator: FC = () => {
  const { activeVault } = useVaultInfo();

  return (
    <Wrapper>
      <Text size="xs" strong>
        {texts.title}
      </Text>
      <AddressBadge
        weight={400}
        address={activeVault?.nodeOperator}
        symbols={21}
      />
    </Wrapper>
  );
};
