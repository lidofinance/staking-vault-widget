import { useState, useCallback } from 'react';
import { ArrowRight } from '@lidofinance/lido-ui';

import { useTierData } from 'features/settings/tier/contexts';
import { SectionData } from 'features/settings/tier/types';
import { PartitionContainer } from '../partition-container';
import { TierBaseInfo } from '../tier-base-info';
import { SelectTierModal } from '../select-tier-modal';

import { ArrowButton } from './styles';

const sectionPayload: SectionData[] = [
  {
    indicator: 'tierName',
  },
  {
    indicator: 'reserveRatio',
  },
  {
    indicator: 'tierStETHLimit',
  },
  {
    indicator: 'liabilityStETH',
  },
];

export const ChooseTier = () => {
  const [showModal, setModalVisibility] = useState(false);
  const { getTierDataToRender } = useTierData();
  const [tierName, reserveRatio, tierStETHLimit, liabilityStETH] =
    sectionPayload.map((item) => getTierDataToRender(item).payload);

  const closeModal = useCallback(() => setModalVisibility(false), []);
  const openModal = useCallback(() => setModalVisibility(true), []);

  return (
    <PartitionContainer title="Choose Tier">
      <TierBaseInfo
        tierName={tierName}
        reserveRatio={reserveRatio}
        tierStETHLimit={tierStETHLimit}
        liabilityStETH={liabilityStETH}
      >
        <ArrowButton onClick={openModal} role="button">
          <ArrowRight />
        </ArrowButton>
      </TierBaseInfo>
      <SelectTierModal showModal={showModal} closeModal={closeModal} />
    </PartitionContainer>
  );
};
