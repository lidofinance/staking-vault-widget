import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { useVaultOverview } from 'features/overview/vault-overview';

import { TextWrapper } from '../../styles';
import { FormatToken } from '../../../../../shared/formatters';

export const RemainingMintingCapacity = () => {
  const { isLoadingVault, values } = useVaultOverview();

  return (
    <>
      {isLoadingVault ? (
        <InlineLoader />
      ) : (
        <TextWrapper>
          <Text
            size="xxs"
            color="secondary"
            data-testid="remain-capacity-label"
          >
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
      )}
    </>
  );
};
