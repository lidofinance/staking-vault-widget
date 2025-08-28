import { useRef } from 'react';
import { Identicon, Text } from '@lidofinance/lido-ui';
import { zeroAddress } from 'viem';

import { vaultTexts } from 'modules/vaults';
import { AddressPopover } from 'shared/components/address-badge/address-popover';

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
  const ref = useRef<HTMLDivElement>(null);
  const { values } = useVaultOverview();

  const { nodeOperator, nodeOperatorFeeRate } = values || {};

  return (
    <NodeOperatorContainer data-testid="noInfo">
      <NodeOperatorParameter>
        <Text size="xxs" color="secondary" data-testid="noLabel">
          {general.nodeOperator}
        </Text>
        <AddressPopover
          address={nodeOperator ?? zeroAddress}
          anchorRef={ref}
          placement="topLeft"
          mode="hover"
          isOpen
        >
          <NodeOperatorAddressWrapper ref={ref}>
            <Identicon
              diameter={16}
              address={nodeOperator ?? zeroAddress}
              data-testid="noIcon"
            />
            <NodeOperatorAddress
              symbols={4}
              address={nodeOperator ?? zeroAddress}
              data-testid="noAddress"
            />
          </NodeOperatorAddressWrapper>
        </AddressPopover>
      </NodeOperatorParameter>
      <SectionDivider type="vertical" />
      <NodeOperatorParameter>
        <Text size="xxs" color="secondary" data-testid="noFeeLabel">
          {general.nodeOperatorFeeRate}
        </Text>
        <Text size="xxs" weight={700} data-testid="noFee">
          {nodeOperatorFeeRate}
        </Text>
      </NodeOperatorParameter>
    </NodeOperatorContainer>
  );
};
