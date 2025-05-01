import { useFormContext } from 'react-hook-form';
import { useEstimateGasFund } from 'features/supply/fund/hooks';
import { useVaultInfo } from 'modules/vaults';

import { Wrapper } from './styles';
import { TxCostRow } from 'shared/components/tx-cost-row';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const amount: bigint | undefined = watch('amount');
  const { activeVault } = useVaultInfo();

  const estimateQuery = useEstimateGasFund({
    address: activeVault?.owner,
    amount: amount ?? 1n,
  });

  return (
    <Wrapper>
      <TxCostRow estimateGasQuery={estimateQuery} />
    </Wrapper>
  );
};
