import { useWatch, useFormState } from 'react-hook-form';
import { Eth } from '@lidofinance/lido-ui';

import { useEthereumBalance } from 'modules/web3';
import { TokenAmountInputGroup } from 'shared/hook-form/controls';
import { InfoRowAmount } from 'shared/components/form';

import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import { InputContainer } from './styles';

export const SupplyInput = () => {
  const { disabled } = useFormState();
  const { data } = useEthereumBalance();

  const isSupplyEth = useWatch<RebalanceFormFieldValues>({
    name: 'isSupplyEth',
  });

  if (!isSupplyEth) {
    return null;
  }

  // TODO: add text to vault texts
  return (
    <InputContainer>
      <InfoRowAmount
        title="Available to supply"
        amount={data}
        token="ETH"
        disabled={disabled}
        data-testid="supplyToRebalanceRow"
      />
      <TokenAmountInputGroup
        amountFieldName="supplyAmount"
        tokenLabel="ETH"
        maxAmount={data}
        leftDecorator={<Eth />}
        disabled={disabled}
      />
    </InputContainer>
  );
};
