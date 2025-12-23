import type { FC, PropsWithChildren } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { formatPercent } from 'utils/formats';
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
import { TierLimitAmount } from './tier-limit-amount';

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
  const reserveRatioValue = formatPercent.format(
    Number(reserveRatio) / VAULT_TOTAL_BASIS_POINTS,
  );
  const available = tierStETHLimit - liabilityStETH;

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
            <Text size="xxs">
              <TierLimitAmount amount={tierStETHLimit} />
            </Text>
          </MintingLimit>
          {!!tierStETHLimit && (
            <MintingAvailable>
              <Text size="xxs" color="secondary">
                Available &nbsp;
              </Text>
              <Text size="xxs">
                <TierLimitAmount amount={available} />{' '}
              </Text>
              <Text size="xxs" color="secondary">
                / <TierLimitAmount amount={tierStETHLimit} />
              </Text>
            </MintingAvailable>
          )}
        </TierAmount>
      </BaseInfoContainer>
      {children}
    </Wrapper>
  );
};
