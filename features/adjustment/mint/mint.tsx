import { MintForm } from './form';
import { MintFormProvider } from './mint-form-context';

export const Mint = () => {
  return (
    <MintFormProvider>
      <MintForm />
    </MintFormProvider>
  );
};
