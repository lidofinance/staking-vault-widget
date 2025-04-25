import { useFormContext } from 'react-hook-form';
import { useEstimateGasWithdraw } from 'features/supply/withdraw/hooks';

import { Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';
import { formatBalance } from 'utils';
import { TxCostRow } from 'shared/components/tx-cost-row';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const [recipient, amount] = watch(['recipient', 'amount']);
  const estimateGasQuery = useEstimateGasWithdraw({
    recipient,
    amount,
  });

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          You will receive
        </Text>
        <AmountInfo>{formatBalance(amount ?? 0n).trimmed} ETH</AmountInfo>
      </InfoRow>
      <TxCostRow estimateGasQuery={estimateGasQuery}></TxCostRow>
    </Wrapper>
  );
};
