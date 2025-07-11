import { InlineLoader } from '@lidofinance/lido-ui';

import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { formatDollar } from 'utils/format-number';

import { useVaultOverview } from 'features/overview/contexts';

import { TextBlack } from './styles';

export const TotalValueUsd = () => {
  const {
    isLoadingVault,
    values: { totalValue },
  } = useVaultOverview();
  const { usdAmount, isLoading } = useEthUsd(totalValue);

  return (
    <>
      {isLoadingVault || isLoading ? (
        <InlineLoader />
      ) : (
        <TextBlack size="xxs" strong>
          {formatDollar.format(usdAmount as number)}
        </TextBlack>
      )}
    </>
  );
};
