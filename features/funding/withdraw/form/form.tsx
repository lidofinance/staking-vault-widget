import { WithdrawFormProvider } from './withdraw-form-context';

import { Withdrawable } from './withdrawble';
import { WithdrawFormInputs } from './inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';
import { WithdrawResumeWarning } from './withdraw-resume-warning';

export const WithdrawForm = () => {
  return (
    <WithdrawFormProvider>
      <Withdrawable />
      <WithdrawFormInputs />
      <WithdrawResumeWarning />
      <SubmitButton />
      <TxInfo />
    </WithdrawFormProvider>
  );
};
