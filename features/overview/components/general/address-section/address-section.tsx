import { useVaultOverview } from 'features/overview/contexts';

import { AddressWithPopover } from 'shared/components';
import { Text } from '@lidofinance/lido-ui';
import { NodeOperator, Title, Wrapper } from './styles';

export const AddressSection = () => {
  const {
    values: { address, nodeOperator },
  } = useVaultOverview();

  return (
    <Wrapper>
      <AddressWithPopover size="lg" address={address} />
      <NodeOperator>
        <Title>
          <Text color="secondary" size="xxs">
            Node operator
          </Text>
        </Title>
        <AddressWithPopover weight={400} address={nodeOperator} />
      </NodeOperator>
    </Wrapper>
  );
};
