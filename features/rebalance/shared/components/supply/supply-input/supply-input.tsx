import { useWatch, useFormState } from 'react-hook-form';
import { Eth } from '@lidofinance/lido-ui';

import { useEthereumBalance } from 'modules/web3';
import { vaultTexts, useEthBalanceWarning } from 'modules/vaults';
import { TokenAmountInputGroup } from 'shared/hook-form/controls';
import { InfoRowAmount } from 'shared/components/form';

import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import { InputContainer } from './styles';

export const SupplyInput = () => {
  const { disabled } = useFormState();
  const { data } = useEthereumBalance();

  const [isSupplyEth, supplyEth] = useWatch<
    RebalanceFormFieldValues,
    ['isSupplyEth', 'supplyEth']
  >({
    name: ['isSupplyEth', 'supplyEth'],
  });

  const balanceWarning = useEthBalanceWarning(supplyEth);

  if (!isSupplyEth) {
    return null;
  }

  return (
    <InputContainer>
      <InfoRowAmount
        title={vaultTexts.actions.rebalance.supply.available}
        amount={data}
        token="ETH"
        disabled={disabled}
        data-testid="supplyToRebalanceRow"
      />
      <TokenAmountInputGroup
        amountFieldName="supplyEth"
        tokenLabel="ETH"
        maxAmount={data}
        leftDecorator={<Eth />}
        disabled={disabled}
        warning={balanceWarning}
      />
    </InputContainer>
  );
};
