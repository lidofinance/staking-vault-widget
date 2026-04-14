import { Section } from 'features/validators/shared';

import { AmountStatistic, AggregateStatuses } from './components';

export const AccumulatedInfo = () => {
  return (
    <Section>
      <AmountStatistic />
      <AggregateStatuses />
    </Section>
  );
};
