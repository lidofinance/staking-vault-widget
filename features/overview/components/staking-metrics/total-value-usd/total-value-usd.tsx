import { InlineLoader } from '@lidofinance/lido-ui';

import { useVaultInfo } from 'modules/vaults';
import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { priceFormatter } from 'shared/formatters';

import { TextBlack } from './styles';

export const TotalValueUsd = () => {
  const { activeVault, isLoadingVault } = useVaultInfo();
  const { usdAmount, isLoading } = useEthUsd(activeVault?.totalValue);

  return (
    <>
      {isLoadingVault || isLoading ? (
        <InlineLoader />
      ) : (
        <TextBlack size="xxs" strong>
          {priceFormatter.format(usdAmount as number)}
        </TextBlack>
      )}
    </>
  );
};
