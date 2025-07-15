import { InlineLoader } from '@lidofinance/lido-ui';

import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { formatDollar } from 'utils/format-number';

import { useVaultOverview } from 'features/overview/vault-overview';

import { TextBlack } from './styles';

export const TotalValueUsd = () => {
  const { isLoadingVault, values } = useVaultOverview();
  const { usdAmount, isLoading } = useEthUsd(values?.totalValue);

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
