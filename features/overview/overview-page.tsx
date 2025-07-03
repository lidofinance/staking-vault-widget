import { VaultOverviewProvider } from 'features/overview/contexts';
import {
  General,
  Health,
  Capacity,
  Balance,
  NodeOperator,
  ReportState,
} from './components';
import { OverviewWrapper } from './styles';

export const OverviewPage = () => {
  return (
    <VaultOverviewProvider>
      <OverviewWrapper>
        <ReportState />
        <General />
        <Health />
        <Capacity />
        <Balance />
        <NodeOperator />
      </OverviewWrapper>
    </VaultOverviewProvider>
  );
};
