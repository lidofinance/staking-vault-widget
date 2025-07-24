import { ArrowRight } from '@lidofinance/lido-ui';

import { PartitionContainer } from '../partition-container';
import { TierBaseInfo } from '../tier-base-info';

import { ArrowButton } from './styles';

export const ChooseTier = () => {
  return (
    <PartitionContainer title="Choose Tier">
      <TierBaseInfo>
        <ArrowButton role="button">
          <ArrowRight />
        </ArrowButton>
      </TierBaseInfo>
    </PartitionContainer>
  );
};
