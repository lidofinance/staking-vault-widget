import { useVaultInfo } from 'features/overview/contexts';

import { AddressBadge } from 'shared/components';
import { Text, Tooltip, Question } from '@lidofinance/lido-ui';
import { NodeOperator, Title, Wrapper } from './styles';

export const AddressSection = () => {
  const { activeVault } = useVaultInfo();

  return (
    <Wrapper>
      <AddressBadge address={activeVault?.address} />
      <NodeOperator>
        <Title>
          <Text color="secondary" size="xxs">
            Node operator
          </Text>
          <Tooltip title={'Node operator'}>
            <Question />
          </Tooltip>
        </Title>
        <AddressBadge address={activeVault?.address} />
      </NodeOperator>
    </Wrapper>
  );
};
