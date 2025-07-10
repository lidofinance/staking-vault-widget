import {
  StakingMetrics,
  ConnectVault,
  General,
  Health,
  Balance,
  Fees,
  ReportState,
} from 'features/overview/components/index';
import { useVaultOverview } from 'features/overview/contexts';
import { SectionDivider } from 'features/overview/shared';

import { OverviewWrapper, Content } from './styles';

export const OverviewContent = () => {
  const {
    isLoadingVault,
    values: { isVaultConnected },
  } = useVaultOverview();

  return (
    <OverviewWrapper>
      <ReportState />
      <Content>
        <General />
        {!isLoadingVault && !isVaultConnected && <ConnectVault />}
        {(isLoadingVault || (!isLoadingVault && isVaultConnected)) && (
          <>
            <SectionDivider />
            <StakingMetrics />
            <Health />
            <SectionDivider />
            <Balance />
            <SectionDivider />
            <Fees />
          </>
        )}
      </Content>
    </OverviewWrapper>
  );
};
