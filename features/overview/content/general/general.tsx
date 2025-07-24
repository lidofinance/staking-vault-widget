import { OverviewSection } from 'features/overview/inner';

import { useVaultOverview } from 'features/overview/vault-overview';

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
