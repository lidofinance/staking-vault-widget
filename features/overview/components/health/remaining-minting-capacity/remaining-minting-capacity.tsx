import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { useVaultOverview } from 'features/overview/contexts';

import { TextWrapper } from '../../styles';

export const RemainingMintingCapacity = () => {
  const {
    isLoadingVault,
    values: { isLoading, remainingMintingCapacityStETH },
  } = useVaultOverview();

  return (
    <>
      {isLoadingVault || isLoading ? (
        <InlineLoader />
      ) : (
        <TextWrapper>
          <Text size="xxs" color="secondary">
            Remaining minting capacity
          </Text>
          <Text size="xxs" strong>
            {remainingMintingCapacityStETH}
          </Text>
        </TextWrapper>
      )}
    </>
  );
};
