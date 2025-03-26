import { Impact } from './impact';
import { WithdrawFormProvider } from './withdraw-form-context/withdraw-form-provider';
import { Form } from './form';

export const Withdraw = () => {
  return (
    <WithdrawFormProvider>
      <Form />
      <Impact />
    </WithdrawFormProvider>
  );
};
