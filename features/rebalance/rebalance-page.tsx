import { PageWrapper } from './styles';
import { RebalanceContent } from './content';

export const RebalancePage = () => {
  return (
    <PageWrapper data-testid="rebalance-page">
      <RebalanceContent />
    </PageWrapper>
  );
};
