import { useState, useCallback } from 'react';
import { ArrowRight } from '@lidofinance/lido-ui';

import { useTierData } from 'features/settings/tier/contexts';
import { PartitionContainer } from '../partition-container';
import { TierBaseInfo } from '../tier-base-info';
import { SelectTierModal } from '../select-tier-modal';

import { ArrowButton } from './styles';

export const ChooseTier = () => {
  const [showModal, setModalVisibility] = useState(false);
  const { values, selectedTier } = useTierData();

  const isActive =
    selectedTier?.id.toString() === values?.vault.tierId.toString();

  const closeModal = useCallback(() => setModalVisibility(false), []);
  const openModal = useCallback(() => setModalVisibility(true), []);

  if (selectedTier === null) return null;

  return (
    <PartitionContainer title="Choose Tier">
      <TierBaseInfo
        tierName={selectedTier.tierName}
        reserveRatio={selectedTier.reserveRatioBP}
        tierStETHLimit={selectedTier.shareLimitStETH}
        liabilityStETH={selectedTier.liabilityStETH}
        isActive={isActive}
      >
        <ArrowButton onClick={openModal} role="button">
          <ArrowRight />
        </ArrowButton>
      </TierBaseInfo>
      <SelectTierModal showModal={showModal} closeModal={closeModal} />
    </PartitionContainer>
  );
};
