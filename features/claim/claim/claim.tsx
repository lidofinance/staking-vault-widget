import { ClaimFormProvider } from './claim-form-context';
import { Form } from './form';

export const Claim = () => {
  return (
    <ClaimFormProvider>
      <Form />
    </ClaimFormProvider>
  );
};
