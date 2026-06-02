import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import {
  UtilizationRatio,
  HealthFactor,
  TotalValue,
  Liability,
} from './components';

import { Container, MetricsContainer } from './styles';

export const VaultMetrics = () => {
  return (
    <Container>
      <Text size="xs" strong>
        {vaultTexts.actions.rebalance.metrics.title}
      </Text>
      <MetricsContainer>
        <UtilizationRatio />
        <Liability />
        <HealthFactor />
        <TotalValue />
      </MetricsContainer>
    </Container>
  );
};
