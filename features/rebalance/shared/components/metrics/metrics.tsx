import { Text } from '@lidofinance/lido-ui';

import {
  UtilizationRatio,
  HealthFactor,
  TotalValue,
  Liability,
} from './components';

import { Container, MetricsContainer } from './styles';

export const VaultMetrics = () => {
  // TODO: add text to vault texts
  return (
    <Container>
      <Text size="xs" strong>
        stVault metrics
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
