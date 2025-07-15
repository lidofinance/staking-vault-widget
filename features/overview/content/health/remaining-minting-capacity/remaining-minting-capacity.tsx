import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { useVaultOverview } from 'features/overview/vault-overview';

import { TextWrapper } from '../../styles';

export const RemainingMintingCapacity = () => {
  const { isLoadingVault, values } = useVaultOverview();

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
            {values?.remainingMintingCapacityStETH ?? '-'}
          </Text>
        </TextWrapper>
      )}
    </>
  );
};
