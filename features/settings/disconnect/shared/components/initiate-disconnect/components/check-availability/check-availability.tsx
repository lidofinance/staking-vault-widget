import { Divider } from '@lidofinance/lido-ui';

import { RepayMinted } from './repay-minted';
import { UnsettledFees } from './unsettled-fees';
import { ManageValidators } from './manage-validators';

import { AvailabilityContainer, PreparationList } from './styles';
import { AvailabilityHeading } from './availability-heading';

export const CheckAvailability = () => {
  return (
    <AvailabilityContainer>
      <AvailabilityHeading />
      <PreparationList>
        <RepayMinted />
        <Divider />
        <UnsettledFees />
        <Divider />
        <ManageValidators />
      </PreparationList>
    </AvailabilityContainer>
  );
};
