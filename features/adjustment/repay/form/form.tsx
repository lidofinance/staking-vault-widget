import { RepayFormProvider } from './repay-form-context';

import { Balance } from './balance';
import { FormInput } from './form-input';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';

export const RepayForm = () => {
  return (
    <RepayFormProvider>
      <Balance />
      <FormInput />
      <SubmitButton />
      <TxInfo />
    </RepayFormProvider>
  );
};
