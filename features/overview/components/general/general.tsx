import { OverviewSection } from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/contexts/vault-overview';

import { VaultBaseInfo } from './vault-base-info';

import { GeneralLoader } from './styles';

export const General = () => {
  const { isLoadingVault } = useVaultOverview();

  return (
    <OverviewSection>
      {isLoadingVault ? <GeneralLoader /> : <VaultBaseInfo />}
    </OverviewSection>
  );
};
