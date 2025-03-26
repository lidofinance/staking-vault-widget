import { Form } from './form';
import { Impact } from './impact';
import { FundFormProvider } from './fund-form-context/fund-form-provider';

export const Fund = () => {
  return (
    <FundFormProvider>
      <Form />
      <Impact />
    </FundFormProvider>
  );
};
