import { useMemo } from 'react';
import { Identicon, Text } from '@lidofinance/lido-ui';
import { zeroAddress } from 'viem';

import { useTierData } from 'features/settings/tier/contexts';
import { SectionData } from 'features/settings/tier/types';

import { InlineLoader } from 'shared/components';
import {
  AddressContainer,
  AddressStyled,
  IndicatorContent,
  Wrapper,
} from './styles';

const sectionPayloadList: SectionData[] = [
  {
    indicator: 'vaultTotalValueETHValue',
  },
  {
    indicator: 'vaultLiabilityStETHValue',
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
        <Identicon
          diameter={40}
          address={values?.address ?? zeroAddress}
          data-testid="vaultIcon"
        />
        <IndicatorContent align="start">
          <Text color="secondary" size="xxs" data-testid="vaultAddressLabel">
            stVault
          </Text>
          <AddressStyled
            address={values?.address ?? zeroAddress}
            data-testid="vaultAddress"
          />
        </IndicatorContent>
      </AddressContainer>
      {dataToRender.map(({ title, payload, indicator }) => (
        <IndicatorContent key={title} align="end" data-testid={indicator}>
          <Text color="secondary" size="xxs" data-testid="label">
            {title}
          </Text>
          <Text size="xs" strong data-testid="value">
            {payload ? (
              payload
            ) : (
              <InlineLoader isLoading width={100} height={20} />
            )}
          </Text>
        </IndicatorContent>
      ))}
    </Wrapper>
  );
};
