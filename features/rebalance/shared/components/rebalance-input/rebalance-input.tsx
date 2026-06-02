import { useFormState } from 'react-hook-form';
import { Eth } from '@lidofinance/lido-ui';

import { InfoRowAmount } from 'shared/components/form';
import { TokenAmountInputGroup } from 'shared/hook-form';

import { Container } from './styles';

export const RebalanceInput = () => {
  const { disabled } = useFormState();

  // TODO: update max button to use recomended
  return (
    <Container>
      <InfoRowAmount
        title="Available to rebalance"
        amount={0n}
        token="ETH"
        disabled={disabled}
        data-testid="availableToRebalanceRow"
      />
      <TokenAmountInputGroup
        amountFieldName="rebalanceAmount"
        tokenLabel="ETH"
        maxAmount={0n}
        leftDecorator={<Eth />}
        disabled={disabled}
      />
    </Container>
  );
};
