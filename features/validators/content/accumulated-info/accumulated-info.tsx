import { Container } from 'features/validators/shared';

import { AmountStatistic, AggregateStatuses } from './components';

export const AccumulatedInfo = () => {
  return (
    <Container>
      <AmountStatistic />
      <AggregateStatuses />
    </Container>
  );
};
