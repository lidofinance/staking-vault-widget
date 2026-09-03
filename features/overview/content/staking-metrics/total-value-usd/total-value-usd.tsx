import { Text } from '@lidofinance/lido-ui';

import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { calculateMaxDecimalDigits, formatDollar } from 'utils';
import { FormatToken } from 'shared/formatters';

import { InlineLoader } from 'shared/components';
import { useGrossTotalSupplied } from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import { TextWrapper } from '../../styles';
import { TextBlack } from './styles';

export const TotalValueUsd = () => {
  const { isLoadingVault, values } = useVaultOverview();
  const { isLoading: isLoadingUsd, usdAmount } = useEthUsd(
    values?.totalValueETH,
  );
  const {
    grossTotalSupplied,
    hasExcess,
    isLoading: isLoadingGross,
  } = useGrossTotalSupplied();

  // While part of what the vault holds is missing from Total Value, that figure alone understates
  // it, so surface the gross amount here instead of the dollar value.
  if (hasExcess) {
    return (
      <InlineLoader isLoading={isLoadingGross}>
        <TextWrapper>
          <Text
            data-testid="grossTotalSuppliedLabel"
            color="secondary"
            size="xxs"
          >
            Gross Total Supplied
          </Text>
          <TextBlack data-testid="grossTotalSuppliedValue" size="xxs" strong>
            <FormatToken
              amount={grossTotalSupplied}
              maxDecimalDigits={calculateMaxDecimalDigits(grossTotalSupplied)}
              symbol="ETH"
            />
          </TextBlack>
        </TextWrapper>
      </InlineLoader>
    );
  }

  return (
    <InlineLoader isLoading={isLoadingUsd || isLoadingVault}>
      {!!usdAmount && (
        <TextBlack data-testid="usdValue" size="xxs" strong>
          {formatDollar.format(usdAmount)}
        </TextBlack>
      )}
    </InlineLoader>
  );
};
