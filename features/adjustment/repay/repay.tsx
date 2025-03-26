import { Impact } from './impact';
import { RepayFormProvider } from './repay-form-context/repay-form-provider';
import { Form } from './form';

export const Repay = () => {
  return (
    <RepayFormProvider>
      <Form />
      <Impact />
    </RepayFormProvider>
  );
};
