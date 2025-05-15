import { useTxCostInUsd } from 'shared/hooks/use-tx-cost-in-usd';
import { useEstimateGasCreateVault } from '../../use-create-vault';
import { TextBold } from './confirmation-data/confirmation-data-item/styles';
import { ListItemCompact, PermissionTitle } from './styles';
import { Loader } from '@lidofinance/lido-ui';
import { FormatPrice } from 'shared/formatters';

export const CreateVaultCost = () => {
  const estimateGasQuery = useEstimateGasCreateVault();
  const usdCostQuery = useTxCostInUsd(estimateGasQuery.data);
  const isLoading = usdCostQuery.isLoading || estimateGasQuery.isLoading;
  const noData = !isLoading && !usdCostQuery.txCostUsd;
  return (
    <ListItemCompact>
      <PermissionTitle>Transaction cost</PermissionTitle>
      <TextBold>
        {isLoading && <Loader size="small" />}
        {usdCostQuery.txCostUsd && (
          <FormatPrice amount={usdCostQuery.txCostUsd} />
        )}
        {noData && '-'}
      </TextBold>
    </ListItemCompact>
  );
};
