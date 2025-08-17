import { Divider } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults/consts';
import { useTierData } from 'features/settings/tier/contexts';

import { PartitionContainer } from '../partition-container';
import { BaseMetrics } from './base-metrics';
import { ExtendedMetrics } from './extended-metrics';

import { Wrapper } from './styles';

export const VaultMetrics = () => {
  const { selectedTier } = useTierData();
  const { watch } = useFormContext();
  const vaultMintingLimit = watch('vaultMintingLimit');

  return (
    <PartitionContainer title={vaultTexts.actions.tier.vaultMetricsTitle}>
      <Wrapper>
        <BaseMetrics />
        <Divider />
        <ExtendedMetrics
          selectedTier={selectedTier}
          newVaultMintingLimit={vaultMintingLimit}
        />
      </Wrapper>
    </PartitionContainer>
  );
};
