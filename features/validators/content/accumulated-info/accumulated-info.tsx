import { Section } from 'features/validators/shared';
import { useValidators } from 'features/validators/contexts';

import { AmountStatistic, AggregateStatuses } from './components';

export const AccumulatedInfo = () => {
  const { isError } = useValidators();

  if (isError) {
    return null;
  }

  return (
    <Section>
      <AmountStatistic />
      <AggregateStatuses />
    </Section>
  );
};
