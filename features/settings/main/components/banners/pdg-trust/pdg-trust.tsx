import { Text, Link } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';

import { useVaultRiskStatus, PDG_POLICY } from 'modules/vaults';
import { PDG_LINK, BannerWithoutTitle } from 'shared/components';

import { useMainSettingsData } from 'features/settings/main/contexts';
import type { MainSettingsFormValidatedValues } from 'features/settings/main/types';

export const PdgTrust = () => {
  const { isNodeOperatorVerified, isLoading, isError } = useVaultRiskStatus();
  const { data } = useMainSettingsData();
  const selectedPdgPolicy = useWatch<MainSettingsFormValidatedValues>({
    name: 'pdgPolicy',
  });

  const showBanner =
    data?.pdgPolicy !== PDG_POLICY.ALLOW_DEPOSIT_AND_PROVE &&
    selectedPdgPolicy === PDG_POLICY.ALLOW_DEPOSIT_AND_PROVE;
  if (!isNodeOperatorVerified || !showBanner || isLoading || isError) {
    return null;
  }

  return (
    <BannerWithoutTitle>
      <Text size="xxs" color="warning">
        By allowing this Node Operator to perform{' '}
        <Link href={PDG_LINK}>unguaranteed deposits</Link>, you confirm that
        there is mutual off-chain trust between the Node Operator and the Vault
        Owner, and that you understand and accept the risks associated with the
        selected Predeposit Guarantee Policy.
      </Text>
    </BannerWithoutTitle>
  );
};
