import {
  StakingMetrics,
  ConnectVault,
  General,
  Health,
  Balance,
  Fees,
} from 'features/overview/components/index';
import { useVaultOverview } from 'features/overview/contexts';
import { SectionDivider } from 'features/overview/shared';

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
          <SectionDivider />
          <Balance />
          <SectionDivider />
          <Fees />
        </>
      )}
    </OverviewWrapper>
  );
};
