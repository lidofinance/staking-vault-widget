import { Text } from '@lidofinance/lido-ui';
import { zeroAddress } from 'viem';

import { useVault, vaultTexts } from 'modules/vaults';

import { useVaultOverview } from 'features/overview/vault-overview';

import { OperatorAddress, OperatorFeeRate } from './components';
import { NodeOperatorParameter, NodeOperatorContainer } from './styles';

const { general } = vaultTexts.metrics;

export const NodeOperator = () => {
  const { values } = useVaultOverview();
  const { activeVault } = useVault();

  const { feeRate } = values ?? {};
  const { nodeOperator, isVaultDisconnected, isNodeOperatorVerified } =
    activeVault ?? {};
  const nodeOperatorAddress = nodeOperator ?? zeroAddress;

  return (
    <NodeOperatorContainer data-testid="noInfo">
      <NodeOperatorParameter>
        <Text size="xxs" color="secondary" data-testid="noLabel">
          {general.nodeOperator}
        </Text>

        <OperatorAddress
          address={nodeOperatorAddress}
          isNodeOperatorVerified={isNodeOperatorVerified}
        />
      </NodeOperatorParameter>
      <OperatorFeeRate
        feeRate={feeRate}
        isVaultDisconnected={isVaultDisconnected}
      />
    </NodeOperatorContainer>
  );
};
