import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { formatDollar } from 'utils';

import { InlineLoader } from 'shared/components';
import { useVaultOverview } from 'features/overview/vault-overview';

import { TextBlack } from './styles';

export const TotalValueUsd = () => {
  const { isLoadingVault, values } = useVaultOverview();
  const { isLoading, usdAmount } = useEthUsd(values?.totalValue);

  return (
    <InlineLoader isLoading={isLoading || isLoadingVault}>
      {!!usdAmount && (
        <TextBlack data-testid="usdValue" size="xxs" strong>
          {formatDollar.format(usdAmount)}
        </TextBlack>
      )}
    </InlineLoader>
  );
};
