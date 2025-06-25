import { Claimable } from './claimable';
import { ClaimInputs } from './claim-inputs';
import { SubmitButton } from './submit-button';
import { FormContainer } from './styles';

export const ClaimForm = () => {
  return (
    <FormContainer>
      <Claimable />
      <ClaimInputs />
      <SubmitButton />
    </FormContainer>
  );
};
