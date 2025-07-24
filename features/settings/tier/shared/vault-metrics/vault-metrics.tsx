import { Divider } from '@lidofinance/lido-ui';

import { PartitionContainer } from '../partition-container';
import { BaseMetrics } from './base-metrics';
import { ExtendedMetrics } from './extended-metrics';

import { Wrapper } from './styles';

export const VaultMetrics = () => {
  // TODO: make re-useable for new tier picked from a list
  return (
    <PartitionContainer title="Current vault metrics">
      <Wrapper>
        <BaseMetrics />
        <Divider />
        <ExtendedMetrics />
      </Wrapper>
    </PartitionContainer>
  );
};
