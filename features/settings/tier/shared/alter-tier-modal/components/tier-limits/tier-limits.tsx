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
    <Container data-testid="syncTier-modal-tierLimits">
      <InfoItem>
        <Text size="xxs" data-testid="syncTier-modal-tierMintingLimit-title">
          Tier minting limit
        </Text>
        <Text size="xxs" data-testid="syncTier-modal-tierMintingLimit">
          <FormatToken amount={tierStETHLimit} symbol="stETH" />
        </Text>
      </InfoItem>
      <InfoItem>
        <Text
          size="xxs"
          data-testid="syncTier-modal-tierRemainingCapacity-title"
        >
          Tier remaining capacity
        </Text>
        <Text size="xxs" data-testid="syncTier-modal-tierRemainingCapacity">
          <FormatToken
            amount={tierStETHLimit - tierLiabilityStETH}
            symbol="stETH"
          />
        </Text>
      </InfoItem>
    </Container>
  );
};
