import { RepayFormProvider } from './repay-form-context';
import { RepayForm } from './form';

export const Repay = () => {
  return (
    <RepayFormProvider>
      <RepayForm />
    </RepayFormProvider>
  );
};
