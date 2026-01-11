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
    <Container>
      {alterTierList.map(({ name, prev, next }) => (
        <InfoRow key={name}>
          <Text size="xxs">{ALTER_TIER_LABELS[name]}</Text>
          <Indicators>
            <Text size="xxs" color="secondary">
              {prev}
            </Text>
            <ArrowRight />
            <Text size="xxs">{next}</Text>
          </Indicators>
        </InfoRow>
      ))}
    </Container>
  );
};
