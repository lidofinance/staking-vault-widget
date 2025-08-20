import { useState, useCallback } from 'react';
import { ArrowRight } from '@lidofinance/lido-ui';

import { useVaultConfirmingRoles } from 'modules/vaults';

import { useTierData } from 'features/settings/tier/contexts';
import { PartitionContainer } from '../partition-container';
import { TierBaseInfo } from '../tier-base-info';
import { SelectTierModal } from '../select-tier-modal';

import { TierSelector } from './styles';

export const ChooseTier = () => {
  const [showModal, setModalVisibility] = useState(false);
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { values, selectedTier } = useTierData();

  const isActive =
    selectedTier?.id.toString() === values?.vault.tierId.toString();

  const closeModal = useCallback(() => setModalVisibility(false), []);
  const openModal = useCallback(() => {
    if (hasConfirmingRole) {
      setModalVisibility(true);
    }
  }, [hasConfirmingRole]);

  if (selectedTier === null) return null;

  return (
    <PartitionContainer title="Choose Tier">
      <TierSelector
        onClick={openModal}
        $showCursor={hasConfirmingRole}
        role="button"
      >
        <TierBaseInfo
          tierName={selectedTier.tierName}
          reserveRatio={selectedTier.reserveRatioBP}
          tierStETHLimit={selectedTier.shareLimitStETH}
          liabilityStETH={selectedTier.liabilityStETH}
          isActive={isActive}
        />
        {hasConfirmingRole && <ArrowRight />}
      </TierSelector>
      <SelectTierModal showModal={showModal} closeModal={closeModal} />
    </PartitionContainer>
  );
};
