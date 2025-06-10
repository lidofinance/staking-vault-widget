import { ClaimFormProvider } from './claim-form-context';

import { Claimable } from './claimable';
import { ClaimInputs } from './claim-inputs';
import { SubmitButton } from './submit-button';

export const ClaimForm = () => {
  return (
    <ClaimFormProvider>
      <Claimable />
      <ClaimInputs />
      <SubmitButton />
    </ClaimFormProvider>
  );
};
