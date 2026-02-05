import { useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { useTierRequest } from 'features/overview/hooks';

import {
  DescriptionWrapper,
  OptionDivider,
  OptionWrapper,
  RequestContainer,
} from './styles';
import { OptionRow } from './option-row';

export const RequestTier = () => {
  const { metrics, proposedTier, proposedVaultLimitStETH } = useTierRequest();

  const metricRows = useMemo(() => {
    if (!metrics) {
      return [];
    }

    return [
      {
        label: 'Reserve ratio',
        value: metrics.reserveRatioBP.newValue,
      },
      {
        label: 'Forced rebalance threshold',
        value: metrics.forcedRebalanceThresholdBP.newValue,
      },
      {
        label: 'Lido infrastructure fee',
        value: metrics.infraFeeBP.newValue,
      },
      {
        label: 'Lido liquidity fee',
        value: metrics.liquidityFeeBP.newValue,
      },
    ];
  }, [metrics]);

  if (
    !metrics ||
    !proposedTier ||
    typeof proposedVaultLimitStETH !== 'bigint'
  ) {
    return null;
  }

  return (
    <RequestContainer>
      <DescriptionWrapper>
        <Text size="xs" strong>
          {proposedTier.tierName} terms
        </Text>
        {metricRows.map(({ label, value }) => (
          <OptionRow key={label} label={label}>
            {value}
          </OptionRow>
        ))}
      </DescriptionWrapper>
      <OptionDivider />
      <OptionWrapper>
        <OptionRow label="stVault minting limit">
          <FormatToken
            amount={proposedVaultLimitStETH}
            maxDecimalDigits={4}
            showAmountTip
            symbol="stETH"
          />
        </OptionRow>
      </OptionWrapper>
    </RequestContainer>
  );
};
