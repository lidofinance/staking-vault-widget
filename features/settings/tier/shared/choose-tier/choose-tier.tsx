import { useState, useCallback } from 'react';
import { ArrowRight } from '@lidofinance/lido-ui';

import { useVaultConfirmingRoles, useVaultPermission } from 'modules/vaults';

import { useTierData } from 'features/settings/tier/contexts';
import { PartitionContainer } from '../partition-container';
import { TierBaseInfo } from '../tier-base-info';
import { SelectTierModal } from '../select-tier-modal';
import { SectionLoader } from '../section-loader';

import { TierSelector } from './styles';
import { useFormState } from 'react-hook-form';

export const ChooseTier = () => {
  const [showModal, setModalVisibility] = useState(false);
  const { disabled } = useFormState();
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('vaultConfiguration');
  const accessPermission =
    !!(hasAdmin || hasPermission || isNodeOperator) && !disabled;
  const { values, selectedTier, isLoadingVault } = useTierData();

  const isActive =
    selectedTier?.id.toString() === values?.vault.tierId.toString();

  const closeModal = useCallback(() => setModalVisibility(false), []);
  const openModal = useCallback(
    () => setModalVisibility(accessPermission),
    [accessPermission],
  );

  return (
    <PartitionContainer
      title="Choose Tier"
      isLoading={isLoadingVault || selectedTier === null}
      fallback={<SectionLoader loaderHeight={86} />}
    >
      <TierSelector
        onClick={openModal}
        $showCursor={accessPermission}
        role="button"
        data-testid="chooseTierWrapper"
      >
        <TierBaseInfo tier={selectedTier} isActive={isActive} />
        {accessPermission && <ArrowRight />}
      </TierSelector>
      <SelectTierModal showModal={showModal} closeModal={closeModal} />
    </PartitionContainer>
  );
};
