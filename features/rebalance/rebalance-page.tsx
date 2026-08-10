import { VaultConnectionBanner } from 'shared/components';

import { RebalanceContent } from './content';

import { BannerContainer, PageWrapper } from './styles';

export const RebalancePage = () => {
  return (
    <PageWrapper data-testid="rebalance-page">
      <BannerContainer>
        <VaultConnectionBanner />
      </BannerContainer>
      <RebalanceContent />
    </PageWrapper>
  );
};
