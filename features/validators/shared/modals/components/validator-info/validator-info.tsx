import { FC, PropsWithChildren } from 'react';
import { Identicon, Divider, Text, Address } from '@lidofinance/lido-ui';
import type { Hex } from 'viem';

import { FormatToken } from 'shared/formatters';

import { SatelliteBeaconchaLink } from '../../../components';
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
    <InfoContainer>
      <BaseInfo>
        <Identicon address={pubKey} diameter={40} />
        <ParamContainer>
          <Text size="xxs" color="secondary">
            Public key
          </Text>
          <PubKeyWrapper>
            <Text size="xs" strong>
              <Address
                address={pubKey}
                symbols={4}
                style={{ fontWeight: 700 }}
              />
            </Text>
            <Text size="xs" color="secondary">
              <SatelliteBeaconchaLink indexOrPubkey={pubKey} />
            </Text>
          </PubKeyWrapper>
        </ParamContainer>
        <ParamContainer>
          <Text size="xxs" color="secondary">
            Index
          </Text>
          <Text size="xs" strong>
            {index}
          </Text>
        </ParamContainer>
      </BaseInfo>
      <Divider />
      <BalanceInfo>
        <BalanceRow>
          <Text size="xxs">Validator actual balance</Text>
          <Text size="xxs" strong>
            <FormatToken amount={balance} symbol="ETH" />
          </Text>
        </BalanceRow>
        {children && <BalanceRow>{children}</BalanceRow>}
      </BalanceInfo>
    </InfoContainer>
  );
};
