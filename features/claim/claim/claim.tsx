import { ClaimFormProvider } from './claim-form-context';
import { ClaimForm } from './form';

export const Claim = () => {
  return (
    <ClaimFormProvider>
      <ClaimForm />
    </ClaimFormProvider>
  );
};
