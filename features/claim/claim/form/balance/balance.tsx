import { Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';
import React from 'react';

export const Balance = () => {
  // todo use wallet account
  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Available to claim
        </Text>
        <AmountInfo>{'4.3415 ETH'}</AmountInfo>
      </InfoRow>
    </Wrapper>
  );
};
