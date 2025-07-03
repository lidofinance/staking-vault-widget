import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { useVaultOverview } from 'features/overview/contexts';

import { TextWrapper } from '../../styles';
import { TextBlack } from './styles';

export const NetStakingRewards = () => {
  const {
    values: { netStakingRewards, isLoading },
  } = useVaultOverview();
  /* TODO get from API*/

  return (
    <>
      {isLoading ? (
        <InlineLoader />
      ) : (
        <TextWrapper>
          <Text color="secondary" size="xxs">
            Net staking rewards
          </Text>
          <TextBlack size="xxs" strong>
            {netStakingRewards || '-'}
          </TextBlack>
        </TextWrapper>
      )}
    </>
  );
};
