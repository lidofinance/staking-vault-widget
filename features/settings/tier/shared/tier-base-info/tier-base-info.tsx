import { FC, PropsWithChildren } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { formatBalance } from 'utils';

import { formatWeiToEthShort } from 'features/settings/tier/const';

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
  tierName?: string;
  reserveRatio?: string;
  tierStETHLimit?: string;
  liabilityStETH?: string;
};

export const TierBaseInfo: FC<PropsWithChildren<TierBaseInfoProps>> = ({
  children,
  tierName,
  reserveRatio,
  tierStETHLimit,
  liabilityStETH,
}) => {
  const mintingLimit = formatWeiToEthShort(tierStETHLimit, 'stETH');

  return (
    <Wrapper>
      <BaseInfoContainer>
        <TierLevel>
          <Text size="xs" strong>
            {tierName}
          </Text>
          <ReserveRatio>
            <Text size="xxs">{reserveRatio}</Text>
            <Text size="xxs" color="secondary">
              Reserve ratio
            </Text>
          </ReserveRatio>
          {/* TODO: check tier activity */}
          <TierStatus>{'Active'}</TierStatus>
        </TierLevel>
        <TierAmount>
          <MintingLimit>
            <Text size="xxs" color="secondary">
              Minting limit
            </Text>
            <Text size="xxs">{mintingLimit}</Text>
          </MintingLimit>
          <MintingAvailable>
            <Text size="xxs" color="secondary">
              Available &nbsp;
            </Text>
            {!!liabilityStETH && (
              <Text size="xxs">
                {formatBalance(BigInt(liabilityStETH)).trimmed} stETH
              </Text>
            )}
            {!!mintingLimit && (
              <Text size="xxs" color="secondary">
                / {mintingLimit}
              </Text>
            )}
          </MintingAvailable>
        </TierAmount>
      </BaseInfoContainer>
      {children}
    </Wrapper>
  );
};
