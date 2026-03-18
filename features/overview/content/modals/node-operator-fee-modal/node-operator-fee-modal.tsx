import { OverviewModal } from 'features/overview/shared';

import { DisburseFee } from './components';

export const NodeOperatorFeeModal = () => {
  return (
    <OverviewModal
      name="undisbursedNodeOperatorFee"
      symbol="ETH"
      amountRightDecorator={<DisburseFee />}
    />
  );
};
