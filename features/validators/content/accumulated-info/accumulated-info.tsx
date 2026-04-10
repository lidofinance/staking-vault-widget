import { Divider } from '@lidofinance/lido-ui';

import { Container } from 'features/validators/shared';

import { AmountStatistic, AggregateStatuses } from './components';

export const AccumulatedInfo = () => {
  return (
    <Container>
      <AmountStatistic />
      <Divider />
      <AggregateStatuses />
    </Container>
  );
};
