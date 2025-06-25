import { Identicon, Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { useVaultOverview } from 'features/overview/contexts';
import { SectionDivider } from 'features/overview/new/shared';

import {
  NodeOperatorAddress,
  NodeOperatorAddressWrapper,
  NodeOperatorParameter,
  NodeOperatorContainer,
} from './styles';

const { general } = vaultTexts.metrics;

export const NodeOperator = () => {
  const {
    values: { nodeOperator, nodeOperatorFeeRate },
  } = useVaultOverview();

  return (
    <NodeOperatorContainer>
      <NodeOperatorParameter>
        <Text size="xxs" color="secondary">
          {general.nodeOperator}
        </Text>
        <NodeOperatorAddressWrapper>
          <Identicon diameter={16} address={nodeOperator} />
          <NodeOperatorAddress symbols={4} address={nodeOperator} />
        </NodeOperatorAddressWrapper>
      </NodeOperatorParameter>
      <SectionDivider type="vertical" />
      <NodeOperatorParameter>
        <Text size="xxs" color="secondary">
          {general.nodeOperatorFeeRate}
        </Text>
        <Text size="xxs" weight={700}>
          {nodeOperatorFeeRate}
        </Text>
      </NodeOperatorParameter>
    </NodeOperatorContainer>
  );
};
