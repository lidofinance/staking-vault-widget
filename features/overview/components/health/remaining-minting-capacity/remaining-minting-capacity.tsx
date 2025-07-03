import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { useVaultOverview } from 'features/overview/contexts';

import { TextWrapper } from '../../styles';

export const RemainingMintingCapacity = () => {
  const {
    isLoadingVault,
    values: { remainingMintingCapacity },
  } = useVaultOverview();

  // TODO: add capacity chart
  return (
    <>
      {isLoadingVault ? (
        <InlineLoader />
      ) : (
        <TextWrapper>
          <Text size="xxs" color="secondary">
            Remaining minting capacity
          </Text>
          <Text size="xxs" strong>
            {remainingMintingCapacity}
          </Text>
        </TextWrapper>
      )}
    </>
  );
};
