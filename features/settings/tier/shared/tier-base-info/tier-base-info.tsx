import { FC, PropsWithChildren, useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { formatPercent, formatWeiToEthShort } from 'utils/formats';
import { VAULT_TOTAL_BASIS_POINTS } from 'modules/vaults';

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
  tierName: string;
  reserveRatio: number;
  tierStETHLimit: bigint;
  liabilityStETH: bigint;
  isActive: boolean;
};

export const TierBaseInfo: FC<PropsWithChildren<TierBaseInfoProps>> = ({
  children,
  tierName,
  reserveRatio,
  tierStETHLimit,
  liabilityStETH,
  isActive,
}) => {
  const baseInfo = useMemo(() => {
    const tierStETHLimitValue = formatWeiToEthShort(tierStETHLimit, 'stETH');
    const availableStETHValue = formatWeiToEthShort(
      tierStETHLimit - liabilityStETH,
    );

    const reserveRatioValue = formatPercent.format(
      Number(reserveRatio) / VAULT_TOTAL_BASIS_POINTS,
    );

    return {
      tierStETHLimitValue,
      availableStETHValue,
      reserveRatioValue,
    };
  }, [reserveRatio, tierStETHLimit, liabilityStETH]);

  return (
    <Wrapper>
      <BaseInfoContainer>
        <TierLevel>
          <Text size="xs" strong>
            {tierName}
          </Text>
          <ReserveRatio>
            <Text size="xxs">{baseInfo.reserveRatioValue}</Text>
            <Text size="xxs" color="secondary">
              Reserve ratio
            </Text>
          </ReserveRatio>
          {isActive && <TierStatus>{'Active'}</TierStatus>}
        </TierLevel>
        <TierAmount>
          <MintingLimit>
            <Text size="xxs" color="secondary">
              Minting limit
            </Text>
            <Text size="xxs">{baseInfo.tierStETHLimitValue}</Text>
          </MintingLimit>
          <MintingAvailable>
            <Text size="xxs" color="secondary">
              Available &nbsp;
            </Text>
            {!!baseInfo.availableStETHValue && (
              <Text size="xxs">{baseInfo.availableStETHValue}&nbsp;</Text>
            )}
            {!!baseInfo.tierStETHLimitValue && (
              <Text size="xxs" color="secondary">
                / {baseInfo.tierStETHLimitValue}
              </Text>
            )}
          </MintingAvailable>
        </TierAmount>
      </BaseInfoContainer>
      {children}
    </Wrapper>
  );
};
