import { Text } from '@lidofinance/lido-ui';

import { useVaultTierInfo } from 'modules/vaults';
import { FormatToken } from 'shared/formatters';

import { Container, InfoItem } from './styles';

export const TierLimits = () => {
  const { data: tierInfoData } = useVaultTierInfo();

  if (!tierInfoData) {
    return null;
  }

  const { tierLiabilityStETH, tierStETHLimit } = tierInfoData;

  return (
    <Container>
      <InfoItem>
        <Text size="xxs">Tier minting limit</Text>
        <Text size="xxs">
          <FormatToken amount={tierStETHLimit} symbol="stETH" />
        </Text>
      </InfoItem>
      <InfoItem>
        <Text size="xxs">Tier remaining capacity</Text>
        <Text size="xxs">
          <FormatToken
            amount={tierStETHLimit - tierLiabilityStETH}
            symbol="stETH"
          />
        </Text>
      </InfoItem>
    </Container>
  );
};
