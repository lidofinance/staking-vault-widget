import { RepayFormProvider } from './repay-form-context';

import { Balance } from './balance';
import { FormInput } from './form-input';
import { SubmitButton } from './submit-button';
import { FeatureTxInfo } from './feature-tx-info';

export const RepayForm = () => {
  return (
    <RepayFormProvider>
      <Balance />
      <FormInput />
      <SubmitButton />
      <FeatureTxInfo />
    </RepayFormProvider>
  );
};
