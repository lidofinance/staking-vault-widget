import { FundFormProvider } from './fund-form-provider';

import { Suppliable } from './suppliable';
import { FundFormInputs } from './fund-form-inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';

export const SupplyForm = () => {
  return (
    <FundFormProvider>
      <Suppliable />
      <FundFormInputs />
      <SubmitButton />
      <TxInfo />
    </FundFormProvider>
  );
};
