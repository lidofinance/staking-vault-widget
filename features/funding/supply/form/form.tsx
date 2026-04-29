import { SupplyFormProvider } from './supply-form-provider';

import { Suppliable } from './suppliable';
import { SupplyFormInputs } from './supply-form-inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';
import { MultipleOwners, OwnedNotBySupplier } from './content';

export const SupplyForm = () => {
  return (
    <SupplyFormProvider>
      <Suppliable />
      <SupplyFormInputs />
      <MultipleOwners />
      <OwnedNotBySupplier />
      <SubmitButton />
      <TxInfo />
    </SupplyFormProvider>
  );
};
