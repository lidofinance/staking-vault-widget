import { FC, PropsWithChildren } from 'react';
import { Identicon, Divider, Text, Address } from '@lidofinance/lido-ui';
import type { Hex } from 'viem';

import { FormatToken } from 'shared/formatters';

import { SatelliteBeaconchaLink } from '../index';
import {
  BalanceInfo,
  BalanceRow,
  BaseInfo,
  InfoContainer,
  ParamContainer,
  PubKeyWrapper,
} from './styles';

type ValidatorInfoProps = {
  pubKey: Hex;
  index: number;
  balance: bigint;
};

export const ValidatorInfo: FC<PropsWithChildren<ValidatorInfoProps>> = ({
  pubKey,
  index,
  balance,
  children,
}) => {
  return (
    <InfoContainer data-testid="validator-info">
      <BaseInfo>
        <span data-testid="pubkey-icon">
          <Identicon address={pubKey} diameter={40} />
        </span>
        <ParamContainer>
          <Text size="xxs" color="secondary">
            Public key
          </Text>
          <PubKeyWrapper>
            <Text size="xs" strong data-testid="pubkey">
              <Address
                as="span"
                address={pubKey}
                symbols={4}
                style={{ fontWeight: 700 }}
              />
            </Text>
            <Text size="xs" color="secondary" data-testid="beacon-link">
              <SatelliteBeaconchaLink indexOrPubkey={pubKey} />
            </Text>
          </PubKeyWrapper>
        </ParamContainer>
        <ParamContainer>
          <Text size="xxs" color="secondary">
            Index
          </Text>
          <Text size="xs" strong data-testid="index">
            {index}
          </Text>
        </ParamContainer>
      </BaseInfo>
      <Divider />
      <BalanceInfo data-testid="balance-info">
        <BalanceRow>
          <Text
            data-testid="validator-balance-label"
            size="xxs"
            color="secondary"
          >
            Validator actual balance
          </Text>
          <Text data-testid="validator-balance-value" size="xxs" strong>
            <FormatToken amount={balance} symbol="ETH" />
          </Text>
        </BalanceRow>
        {children && <BalanceRow>{children}</BalanceRow>}
      </BalanceInfo>
    </InfoContainer>
  );
};
