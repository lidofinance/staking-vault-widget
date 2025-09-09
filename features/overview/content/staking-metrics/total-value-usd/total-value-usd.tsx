import { InlineLoader } from '@lidofinance/lido-ui';

import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { formatDollar } from 'utils';

import { useVaultOverview } from 'features/overview/vault-overview';

import { TextBlack } from './styles';

export const TotalValueUsd = () => {
  const { isLoadingVault, values } = useVaultOverview();
  const { isLoading, usdAmount } = useEthUsd(values?.totalValue);

  return (
    <>
      {isLoadingVault || (isLoading && <InlineLoader />)}
      {!!usdAmount && (
        <TextBlack data-testid="usdValue" size="xxs" strong>
          {formatDollar.format(usdAmount)}
        </TextBlack>
      )}
    </>
  );
};
