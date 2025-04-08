import { WithdrawFormProvider } from './withdraw-form-context';
import { WithdrawForm } from './form';

export const Withdraw = () => {
  return (
    <WithdrawFormProvider>
      <WithdrawForm />
    </WithdrawFormProvider>
  );
};
