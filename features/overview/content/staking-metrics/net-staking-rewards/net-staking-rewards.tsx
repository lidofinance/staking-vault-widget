import { Text, InlineLoader } from '@lidofinance/lido-ui';

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
            {values?.netStakingRewardsEth || '-'}
          </TextBlack>
        </TextWrapper>
      )}
    </>
  );
};
