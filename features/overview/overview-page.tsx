import { General, Health, Capacity, Balance, NodeOperator } from './components';
import { OverviewWrapper } from './styles';

export const OverviewPage = () => {
  return (
    <OverviewWrapper>
      <General />
      <Health />
      <Capacity />
      <Balance />
      <NodeOperator />
    </OverviewWrapper>
  );
};
