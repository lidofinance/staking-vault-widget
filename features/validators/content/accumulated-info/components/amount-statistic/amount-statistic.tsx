import { ValidatorsStatistic, LastUpdated } from 'features/validators/shared';
import { useValidators } from 'features/validators/contexts';

import { Container, StatisticWrapper } from './styles';

export const AmountStatistic = () => {
  const { meta, isLoading } = useValidators();

  return (
    <Container>
      <StatisticWrapper>
        <ValidatorsStatistic
          title="Deposited on validators"
          amount={meta?.totalBalance}
          data-testid="deposited-balance"
        />
        <ValidatorsStatistic
          title="In a queue"
          amount={meta?.offBookBalance}
          data-testid="in-queue-balance"
        />
      </StatisticWrapper>

      <LastUpdated timestamp={meta?.timestamp} isLoading={isLoading} />
    </Container>
  );
};
