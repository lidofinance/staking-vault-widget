import { InlineLoader } from '@lidofinance/lido-ui';

import { useVaultOverviewData } from 'modules/vaults';
import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { formatDollar } from 'utils/format-number';

import { TextBlack } from './styles';

export const TotalValueUsd = () => {
  const { data: activeVault, isLoading: isLoadingVault } =
    useVaultOverviewData();
  const { usdAmount, isLoading } = useEthUsd(activeVault?.totalValue);

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
