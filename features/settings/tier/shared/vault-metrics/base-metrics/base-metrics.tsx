import { Identicon, Text } from '@lidofinance/lido-ui';

import {
  AddressContainer,
  AddressStyled,
  IndicatorContent,
  Wrapper,
} from './styles';

export const BaseMetrics = () => {
  return (
    <Wrapper>
      <AddressContainer>
        <Identicon diameter={40} address="0x" />
        <IndicatorContent align="start">
          <Text color="secondary" size="xxs">
            stVault
          </Text>
          <AddressStyled address="0x" />
        </IndicatorContent>
      </AddressContainer>
      <IndicatorContent align="end">
        <Text color="secondary" size="xxs">
          Total value
        </Text>
        <Text size="xs" strong>
          10 000 ETH
        </Text>
      </IndicatorContent>
      <IndicatorContent align="end">
        <Text color="secondary" size="xxs">
          Liability
        </Text>
        <Text size="xs" strong>
          4 500 stETH
        </Text>
      </IndicatorContent>
    </Wrapper>
  );
};
