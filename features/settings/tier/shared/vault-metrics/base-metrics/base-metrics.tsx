import { useMemo } from 'react';
import { Identicon, Text } from '@lidofinance/lido-ui';
import { zeroAddress } from 'viem';

import { useTierData } from 'features/settings/tier/contexts';
import { SectionData } from 'features/settings/tier/types';

import {
  AddressContainer,
  AddressStyled,
  IndicatorContent,
  Wrapper,
  InlineLoaderStyled,
} from './styles';

const sectionPayloadList: SectionData[] = [
  {
    indicator: 'totalValueETH',
  },
  {
    indicator: 'liabilityAmountStETH',
  },
];

export const BaseMetrics = () => {
  const { getTierDataToRender, values } = useTierData();

  const dataToRender = useMemo(() => {
    return sectionPayloadList.map(({ indicator }) =>
      getTierDataToRender({ indicator }),
    );
  }, [getTierDataToRender]);

  return (
    <Wrapper>
      <AddressContainer>
        <Identicon diameter={40} address={values?.address ?? zeroAddress} />
        <IndicatorContent align="start">
          <Text color="secondary" size="xxs">
            stVault
          </Text>
          <AddressStyled address={values?.address ?? zeroAddress} />
        </IndicatorContent>
      </AddressContainer>
      {dataToRender.map(({ title, payload }) => (
        <IndicatorContent key={title} align="end">
          <Text color="secondary" size="xxs">
            {title}
          </Text>
          <Text size="xs" strong>
            {payload ? payload : <InlineLoaderStyled />}
          </Text>
        </IndicatorContent>
      ))}
    </Wrapper>
  );
};
