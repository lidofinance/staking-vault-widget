import { Text, Loader } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow } from './styles';
import { useTxCostInUsd } from 'shared/hooks/use-tx-cost-in-usd';
import { FormatPrice } from 'shared/formatters';

type TxCostRowProps = {
  estimateGasQuery: {
    data: bigint | undefined;
    isLoading: boolean;
    error: unknown;
  };
};

export const TxCostRow = ({ estimateGasQuery }: TxCostRowProps) => {
  const usdCostQuery = useTxCostInUsd(estimateGasQuery.data);
  const isLoading = usdCostQuery.isLoading || estimateGasQuery.isLoading;
  const noData = !isLoading && !usdCostQuery.txCostUsd;
  return (
    <InfoRow>
      <Text size="xxs" color="secondary">
        Transaction cost
      </Text>
      {isLoading && <Loader size="small" />}
      {usdCostQuery.txCostUsd && (
        <AmountInfo>
          <FormatPrice amount={usdCostQuery.txCostUsd} />
        </AmountInfo>
      )}
      {noData && <AmountInfo>-</AmountInfo>}
    </InfoRow>
  );
};
