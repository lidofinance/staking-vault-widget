import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { SectionDivider } from 'features/overview/inner';

import { NodeOperatorParameter } from '../../styles';
import { FeeContainer } from './styles';

const { general } = vaultTexts.metrics;

type OperatorFeeRateProps = {
  feeRate: string | undefined;
  isVaultDisconnected: boolean | undefined;
};

export const OperatorFeeRate: FC<OperatorFeeRateProps> = ({
  feeRate,
  isVaultDisconnected,
}) => {
  if (isVaultDisconnected) {
    return null;
  }

  return (
    <FeeContainer>
      <SectionDivider type="vertical" />
      <NodeOperatorParameter>
        <Text size="xxs" color="secondary" data-testid="noFeeLabel">
          {general.feeRate}
        </Text>
        <Text size="xxs" weight={700} data-testid="noFee">
          {feeRate}
        </Text>
      </NodeOperatorParameter>
    </FeeContainer>
  );
};
