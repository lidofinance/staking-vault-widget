import { useState, useCallback } from 'react';
import { ArrowRight } from '@lidofinance/lido-ui';

import { useVaultConfirmingRoles, useVaultPermission } from 'modules/vaults';

import { useTierData } from 'features/settings/tier/contexts';
import { PartitionContainer } from '../partition-container';
import { TierBaseInfo } from '../tier-base-info';
import { SelectTierModal } from '../select-tier-modal';

import { TierSelector } from './styles';

export const ChooseTier = () => {
  const [showModal, setModalVisibility] = useState(false);
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('vaultConfiguration');
  const accessPermission = !!(hasAdmin || hasPermission || isNodeOperator);
  const { values, selectedTier } = useTierData();

  const isActive =
    selectedTier?.id.toString() === values?.vault.tierId.toString();

  const closeModal = useCallback(() => setModalVisibility(false), []);
  const openModal = useCallback(
    () => setModalVisibility(accessPermission),
    [accessPermission],
  );

  if (selectedTier === null) return null;

  return (
    <PartitionContainer title="Choose Tier">
      <TierSelector
        onClick={openModal}
        $showCursor={accessPermission}
        role="button"
        data-testid="chooseTierWrapper"
      >
        <TierBaseInfo
          tierName={selectedTier.tierName}
          reserveRatio={selectedTier.reserveRatioBP}
          tierStETHLimit={selectedTier.shareLimitStETH}
          liabilityStETH={selectedTier.liabilityStETH}
          isActive={isActive}
        />
        {accessPermission && <ArrowRight />}
      </TierSelector>
      <SelectTierModal showModal={showModal} closeModal={closeModal} />
    </PartitionContainer>
  );
};
