import { WithdrawFormProvider } from './withdraw-form-context';
import { Withdrawable } from './withdrawable';
import { WithdrawFormInputs } from './inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';

export const WithdrawForm = () => {
  return (
    <WithdrawFormProvider>
      <Withdrawable />
      <WithdrawFormInputs />
      <SubmitButton />
      <TxInfo />
    </WithdrawFormProvider>
  );
};
