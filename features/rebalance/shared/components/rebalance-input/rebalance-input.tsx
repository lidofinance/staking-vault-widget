import { useFormState } from 'react-hook-form';
import { Eth } from '@lidofinance/lido-ui';

import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { InfoRowAmount } from 'shared/components/form';
import { TokenAmountInputGroup } from 'shared/hook-form';

import { Container } from './styles';

export const RebalanceInput = () => {
  const { disabled } = useFormState();
  const { data } = useVaultOverviewData();
  const { rebalanceETH } = data ?? {};

  return (
    <Container>
      <InfoRowAmount
        title={vaultTexts.actions.rebalance.input.available}
        amount={rebalanceETH}
        token="ETH"
        disabled={disabled}
        data-testid="availableToRebalanceRow"
      />
      <TokenAmountInputGroup
        amountFieldName="rebalanceAmount"
        tokenLabel="ETH"
        maxAmount={rebalanceETH}
        leftDecorator={<Eth />}
        disabled={disabled}
      />
    </Container>
  );
};
