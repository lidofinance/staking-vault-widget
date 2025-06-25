import {
  StakingMetrics,
  ConnectVault,
  General,
} from 'features/overview/new/components';
import {
  Balance,
  Capacity,
  Health,
  NodeOperator,
} from 'features/overview/components';
import { useVaultOverview } from 'features/overview/contexts';
import { SectionDivider } from 'features/overview/new/shared';

import { OverviewWrapper } from './styles';

export const OverviewContent = () => {
  const {
    isLoadingVault,
    values: { isVaultConnected },
  } = useVaultOverview();

  return (
    <OverviewWrapper>
      <General />
      {!isLoadingVault && !isVaultConnected && <ConnectVault />}
      {(isLoadingVault || (!isLoadingVault && isVaultConnected)) && (
        <>
          <SectionDivider />
          <StakingMetrics />
          <Health />
          <Capacity />
          <SectionDivider />
          <Balance />
          <SectionDivider />
          <NodeOperator />
        </>
      )}
    </OverviewWrapper>
  );
};
