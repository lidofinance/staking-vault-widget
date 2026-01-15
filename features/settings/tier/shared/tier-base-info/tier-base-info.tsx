import type { FC, PropsWithChildren } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { formatPercent } from 'utils/formats';
import { type Tier, VAULT_TOTAL_BASIS_POINTS } from 'modules/vaults';

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
import { TierLimitAmount } from './tier-limit-amount';

type TierBaseInfoProps = {
  tier: Tier | null;
  isActive: boolean;
};

export const TierBaseInfo: FC<PropsWithChildren<TierBaseInfoProps>> = ({
  children,
  tier,
  isActive,
}) => {
  if (!tier) return null;

  const { tierName, reserveRatioBP, shareLimitStETH, liabilityStETH } = tier;
  const reserveRatioValue = formatPercent.format(
    Number(reserveRatioBP) / VAULT_TOTAL_BASIS_POINTS,
  );
  const available = shareLimitStETH - liabilityStETH;

  return (
    <Wrapper>
      <BaseInfoContainer>
        <TierLevel>
          <Text size="xs" strong data-testid="tierName">
            {tierName}
          </Text>
          <ReserveRatio data-testid="tierRR">
            <Text size="xxs">{reserveRatioValue}</Text>
            <Text size="xxs" color="secondary">
              Reserve ratio
            </Text>
          </ReserveRatio>
          {isActive && (
            <TierStatus data-testid="tierStatus">{'Active'}</TierStatus>
          )}
        </TierLevel>
        <TierAmount>
          <MintingLimit>
            <Text size="xxs" color="secondary">
              Minting limit
            </Text>
            <Text size="xxs" data-testid="tierMintingLimit">
              <TierLimitAmount amount={shareLimitStETH} />
            </Text>
          </MintingLimit>
          {!!shareLimitStETH && (
            <MintingAvailable>
              <Text size="xxs" color="secondary">
                Available &nbsp;
              </Text>
              <Text size="xxs" data-testid="tierAvailableMinting">
                <TierLimitAmount amount={available} />
              </Text>
              &nbsp;
              <Text size="xxs" color="secondary">
                / <TierLimitAmount amount={shareLimitStETH} />
              </Text>
            </MintingAvailable>
          )}
        </TierAmount>
      </BaseInfoContainer>
      {children}
    </Wrapper>
  );
};
