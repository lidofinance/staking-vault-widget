import type { FC } from 'react';
import { Text, ArrowRight } from '@lidofinance/lido-ui';

import type { VaultTierData } from 'features/settings/tier/hooks';
import { ALTER_TIER_LABELS } from 'features/settings/tier/const';

import { Container, Indicators, InfoRow } from './styles';

type MainInfoProps = {
  alterTierList: VaultTierData['alterTierList'];
};

export const MainInfo: FC<MainInfoProps> = ({ alterTierList }) => {
  return (
    <Container data-testid="syncTier-modal-mainInfo">
      {alterTierList.map(({ name, prev, next }) => (
        <InfoRow key={name} data-testid={`syncTier-modal-${name}-row`}>
          <Text size="xxs" data-testid={`syncTier-modal-${name}-title`}>
            {ALTER_TIER_LABELS[name]}
          </Text>
          <Indicators>
            <Text
              size="xxs"
              color="secondary"
              data-testid={`syncTier-modal-${name}-before`}
            >
              {prev}
            </Text>
            <ArrowRight />
            <Text size="xxs" data-testid={`syncTier-modal-${name}-after`}>
              {next}
            </Text>
          </Indicators>
        </InfoRow>
      ))}
    </Container>
  );
};
