import { Wrapper } from './styles';
import { useFormContext } from 'react-hook-form';
import { TxCostRow } from 'shared/components/tx-cost-row';
import { useEstimateGasBurn } from '../../hooks';
import { AllowanceDataTableRow } from 'shared/components/allowance-data-table-row';
import { useAllowance } from 'modules/web3';
import { useTokenAddress } from 'shared/hooks/use-token-address';
import { useVaultInfo } from 'features/overview/contexts';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const { activeVault } = useVaultInfo();
  const [token, amount] = watch(['token', 'amount']);
  const tokenAddress = useTokenAddress(token);

  const { data } = useAllowance({
    token: tokenAddress,
    spender: activeVault?.owner,
  });

  const estimateGasQuery = useEstimateGasBurn({
    token,
    amount,
    allowance: data,
  });

  return (
    <Wrapper>
      <TxCostRow estimateGasQuery={estimateGasQuery} />
      <AllowanceDataTableRow token={token} allowance={data} />
    </Wrapper>
  );
};
