import { Text } from '@lidofinance/lido-ui';

import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { calculateMaxDecimalDigits, formatDollar } from 'utils';
import { FormatToken } from 'shared/formatters';

import { InlineLoader } from 'shared/components';
import { useVaultValidatorsMeta } from 'modules/vaults';
import { useVaultOverview } from 'features/overview/vault-overview';

import { TextWrapper } from '../../styles';
import { TextBlack } from './styles';

export const TotalValueUsd = () => {
  const { isLoadingVault, values } = useVaultOverview();
  const { isLoading: isLoadingUsd, usdAmount } = useEthUsd(
    values?.totalValueETH,
  );
  const { meta, isLoading: isLoadingValidators } = useVaultValidatorsMeta();

  // Off-book deposits sit in the beacon chain queue and the oracle does not
  // count them in Total Value yet, so TV alone understates what the vault holds.
  // While any are pending we surface the sum instead of the dollar amount.
  const offBookBalance = meta?.offBookBalance ?? 0n;

  if (offBookBalance > 0n) {
    const grossTotalSupplied = (values?.totalValueETH ?? 0n) + offBookBalance;

    return (
      <InlineLoader isLoading={isLoadingVault || isLoadingValidators}>
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
