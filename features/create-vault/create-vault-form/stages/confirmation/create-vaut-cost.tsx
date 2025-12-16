import { Loader } from '@lidofinance/lido-ui';

import { useTxCostInUsd } from 'shared/hooks/use-tx-cost-in-usd';
import { FormatPrice } from 'shared/formatters';

import { useEstimateGasCreateVault } from '../../use-create-vault';
import { TextBold } from './confirmation-entry/styles';
import { ListItemCompact, ConfirmationLabel } from './styles';

export const CreateVaultCost = () => {
  const estimateGasQuery = useEstimateGasCreateVault();
  const usdCostQuery = useTxCostInUsd(estimateGasQuery.data);
  const isLoading = usdCostQuery.isLoading || estimateGasQuery.isLoading;
  const isEmpty = !isLoading && !usdCostQuery.txCostUsd;

  return (
    <ListItemCompact>
      <ConfirmationLabel
        data-testid={`createVault-confirmation-transactionCost-label`}
      >
        Transaction cost
      </ConfirmationLabel>
      <TextBold data-testid={`createVault-confirmation-transactionCost-value`}>
        {isLoading && <Loader size="small" />}
        {usdCostQuery.txCostUsd && (
          <FormatPrice amount={usdCostQuery.txCostUsd} />
        )}
        {isEmpty && '-'}
      </TextBold>
    </ListItemCompact>
  );
};
