import { RepayFormProvider } from './repay-form-context';

import { Repayable } from './repayable';
import { RepayFormInputs } from './repay-form-inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';

export const RepayForm = () => {
  return (
    <RepayFormProvider>
      <Repayable />
      <RepayFormInputs />
      <SubmitButton />
      <TxInfo />
    </RepayFormProvider>
  );
};
