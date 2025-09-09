import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { useVaultOverview } from 'features/overview/vault-overview';

import { TextWrapper } from '../../styles';
import { TextBlack } from './styles';

export const NetStakingRewards = () => {
  const { isLoadingVault, values } = useVaultOverview();

  return (
    <>
      {isLoadingVault ? (
        <InlineLoader />
      ) : (
        <TextWrapper>
          <Text data-testid="netRewardsLabel" color="secondary" size="xxs">
            Net staking rewards
          </Text>
          <TextBlack data-testid="netRewardsValue" size="xxs" strong>
            <FormatToken
              amount={values?.netStakingRewards}
              maxDecimalDigits={12}
              adaptiveDecimals
              symbol="ETH"
            />
          </TextBlack>
        </TextWrapper>
      )}
    </>
  );
};
