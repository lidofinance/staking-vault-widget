import { Identicon, Text } from '@lidofinance/lido-ui';
import { zeroAddress } from 'viem';

import { vaultTexts } from 'modules/vaults';

import { SectionDivider } from 'features/overview/inner';

import { useVaultOverview } from 'features/overview/vault-overview';

import {
  NodeOperatorAddress,
  NodeOperatorAddressWrapper,
  NodeOperatorParameter,
  NodeOperatorContainer,
} from './styles';

const { general } = vaultTexts.metrics;

export const NodeOperator = () => {
  const { values } = useVaultOverview();

  const { nodeOperator, nodeOperatorFeeRate } = values || {};

  return (
    <NodeOperatorContainer>
      <NodeOperatorParameter>
        <Text size="xxs" color="secondary">
          {general.nodeOperator}
        </Text>
        <NodeOperatorAddressWrapper>
          <Identicon diameter={16} address={nodeOperator ?? zeroAddress} />
          <NodeOperatorAddress
            symbols={4}
            address={nodeOperator ?? zeroAddress}
          />
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
