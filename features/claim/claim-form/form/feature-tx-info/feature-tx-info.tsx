import { useFormContext } from 'react-hook-form';
import { Wrapper } from './styles';
import { useEstimateClaim } from 'features/claim/claim-form/hooks';
import { Address } from 'viem';
import { TxCostRow } from 'shared/components/tx-cost-row';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const recipient: Address = watch('recipient');
  const estimateQuery = useEstimateClaim(recipient);

  return (
    <Wrapper>
      <TxCostRow estimateGasQuery={estimateQuery} />
    </Wrapper>
  );
};
