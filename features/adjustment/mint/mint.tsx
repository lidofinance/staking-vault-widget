import { Form } from './form';
import { Impact } from './impact';
import { MintFormProvider } from './mint-form-context/mint-form-provider';

export const Mint = () => {
  return (
    <MintFormProvider>
      <Form />
      <Impact />
    </MintFormProvider>
  );
};
