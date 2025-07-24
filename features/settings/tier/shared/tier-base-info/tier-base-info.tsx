import { FC, PropsWithChildren } from 'react';
import { Text } from '@lidofinance/lido-ui';

import {
  Wrapper,
  BaseInfoContainer,
  TierLevel,
  TierAmount,
  MintingLimit,
  MintingAvailable,
  ReserveRatio,
  TierStatus,
} from './styles';

type TierBaseInfoProps = {
  tierId: string;
};

export const TierBaseInfo: FC<PropsWithChildren<TierBaseInfoProps>> = ({
  children,
}) => {
  return (
    <Wrapper>
      <BaseInfoContainer>
        <TierLevel>
          <Text size="xs" strong>
            Tier 1
          </Text>
          <ReserveRatio>
            <Text size="xxs">10%</Text>
            <Text size="xxs" color="secondary">
              Reserve ratio
            </Text>
          </ReserveRatio>
          <TierStatus>Active</TierStatus>
        </TierLevel>
        <TierAmount>
          <MintingLimit>
            <Text size="xxs" color="secondary">
              Minting limit
            </Text>
            <Text size="xxs">50K stETH</Text>
          </MintingLimit>
          <MintingAvailable>
            <Text size="xxs" color="secondary">
              Available &nbsp;
            </Text>
            <Text size="xxs">10K</Text>
            <Text size="xxs" color="secondary">
              / 50K stETH
            </Text>
          </MintingAvailable>
        </TierAmount>
      </BaseInfoContainer>
      {children}
    </Wrapper>
  );
};
