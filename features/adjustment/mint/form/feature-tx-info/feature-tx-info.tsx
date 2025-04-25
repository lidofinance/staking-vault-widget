import { useFormContext } from 'react-hook-form';
import { useEstimateMint } from 'features/adjustment/mint/hooks';

import { Wrapper } from './styles';
import { TxCostRow } from 'shared/components/tx-cost-row';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const [token, amount, recipient] = watch(['token', 'amount', 'recipient']);
  const estimateGasQuery = useEstimateMint({
    token,
    amount,
    recipient,
  });

  return (
    <Wrapper>
      <TxCostRow estimateGasQuery={estimateGasQuery}></TxCostRow>
    </Wrapper>
  );
};
