import { SupplyFormProvider } from './supply-form-provider';

import { Suppliable } from './suppliable';
import { SupplyFormInputs } from './supply-form-inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';

export const SupplyForm = () => {
  return (
    <SupplyFormProvider>
      <Suppliable />
      <SupplyFormInputs />
      <SubmitButton />
      <TxInfo />
    </SupplyFormProvider>
  );
};
