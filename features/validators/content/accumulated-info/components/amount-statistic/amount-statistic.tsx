import { ValidatorsStatistic, LastUpdated } from 'features/validators/shared';
import { useValidators } from 'features/validators/contexts';

import { Wrapper } from './styles';

export const AmountStatistic = () => {
  const { meta, isLoading } = useValidators();

  return (
    <Wrapper>
      <ValidatorsStatistic
        title="Deposited on validators"
        amount={meta?.totalBalance}
      />
      <LastUpdated timestamp={meta?.timestamp} isLoading={isLoading} />
    </Wrapper>
  );
};
