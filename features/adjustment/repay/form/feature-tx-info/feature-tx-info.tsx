import { Wrapper } from './styles';
import { useFormContext } from 'react-hook-form';
import { TxCostRow } from 'shared/components/tx-cost-row';
import { useEstimateGasBurn } from '../../hooks';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const [token, amount] = watch(['token', 'amount']);
  const estimateGasQuery = useEstimateGasBurn({ token, amount });

  return (
    <Wrapper>
      <TxCostRow estimateGasQuery={estimateGasQuery} />
    </Wrapper>
  );
};
