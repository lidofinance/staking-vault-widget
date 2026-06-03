import { useIsForceRebalance } from 'features/rebalance/hooks';

import { Container } from './styles';
import { Description } from './description';
import { SupplyInput } from './supply-input';
import { SupplyToggle } from './supply-toggle';

export const Supply = () => {
  const isForceRebalance = useIsForceRebalance();

  // Supplying ETH alongside a forced rebalance is not allowed
  if (isForceRebalance) return null;

  return (
    <Container>
      <SupplyToggle />
      <SupplyInput />
      <Description />
    </Container>
  );
};
