import {
  ValidatorsStatistic,
  LastUpdated,
  OffBookDepositsHint,
} from 'features/validators/shared';
import { useValidators } from 'features/validators/contexts';

import { Container, StatisticWrapper } from './styles';

export const AmountStatistic = () => {
  const { meta, isLoading } = useValidators();

  return (
    <Container>
      <StatisticWrapper>
        <ValidatorsStatistic
          title="Total actual balance"
          amount={meta?.totalBalance}
          data-testid="deposited-balance"
        />
        <ValidatorsStatistic
          title="Top-ups and initial PDG deposits"
          amount={meta?.pdgBalance}
          data-testid="top-up-balance"
          hideOnZero
        />
        <ValidatorsStatistic
          title="Off-Book deposits"
          hint={<OffBookDepositsHint />}
          amount={meta?.offBookBalance}
          data-testid="off-book-balance"
          hideOnZero
        />
      </StatisticWrapper>

      <LastUpdated timestamp={meta?.timestamp} isLoading={isLoading} />
    </Container>
  );
};
