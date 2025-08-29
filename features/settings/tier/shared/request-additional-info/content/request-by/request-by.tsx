import { FC } from 'react';
import { Identicon, Text } from '@lidofinance/lido-ui';
import type { Address } from 'viem';

import { useDappStatus } from 'modules/web3';

import { AddressStyled, RequestByContainer } from './styles';

type RequestByProps = {
  address: Address;
};

export const RequestBy: FC<RequestByProps> = ({ address }) => {
  const { address: connectedAddress } = useDappStatus();

  return (
    <RequestByContainer>
      <Identicon diameter={16} address={address} />
      <AddressStyled address={address} />
      {connectedAddress === address && (
        <Text size="xxs" color="secondary">
          (you)
        </Text>
      )}
    </RequestByContainer>
  );
};
