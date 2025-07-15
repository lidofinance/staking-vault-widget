import { useVaultOverview } from 'features/overview/vault-overview';

import { ReportState } from './report-state';

import { Balance } from './balance';
import { ConnectVault } from './connect-vault';
import { Fees } from './fees';
import { General } from './general';
import { Health } from './health';
import { StakingMetrics } from './staking-metrics';

import { SectionDivider } from '../shared';

import { OverviewWrapper, Content } from './styles';

export const OverviewContent = () => {
  const { isLoadingVault, values } = useVaultOverview();

  return (
    <OverviewWrapper>
      <ReportState />
      <Content>
        <General />
        {isLoadingVault || values?.isVaultConnected ? (
          <>
            <SectionDivider />
            <StakingMetrics />
            <Health />
            <SectionDivider />
            <Balance />
            <SectionDivider />
            <Fees />
          </>
        ) : (
          <ConnectVault />
        )}
      </Content>
    </OverviewWrapper>
  );
};
