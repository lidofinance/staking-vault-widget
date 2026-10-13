import {
  Chart,
  HeathFactor,
  UtilizationRatio,
  StEthLiability,
  CapacityExceeded,
  ThresholdExceeded,
} from './components';

import { Container, List } from './styles';

export const HealthState = () => {
  return (
    <Container>
      <CapacityExceeded />
      <ThresholdExceeded />
      <List data-testid="header-metrics">
        <UtilizationRatio />
        <StEthLiability />
        <HeathFactor />
      </List>
      <Chart />
    </Container>
  );
};
