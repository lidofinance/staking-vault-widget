import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { useVaultOverview } from 'features/overview/vault-overview';
import { InlineLoader } from 'shared/components';

import { TextWrapper } from '../../styles';

export const RemainingMintingCapacity = () => {
  const { isLoadingVault, values } = useVaultOverview();

  return (
    <InlineLoader isLoading={isLoadingVault}>
      <TextWrapper>
        <Text size="xxs" color="secondary" data-testid="remain-capacity-label">
          Remaining minting capacity
        </Text>
        <Text size="xxs" strong data-testid="remain-capacity">
          <FormatToken
            amount={values?.mintableStETH}
            maxDecimalDigits={10}
            symbol="stETH"
          />
        </Text>
      </TextWrapper>
    </InlineLoader>
  );
};
