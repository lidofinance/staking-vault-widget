import { Claimable } from './claimable';
import { DisburseInputs } from './disburse-inputs';
import { SubmitButton } from './submit-button';
import { FormContainer } from './styles';

export const DisburseForm = () => {
  return (
    <FormContainer data-testid="claimForm">
      <Claimable />
      <DisburseInputs />
      <SubmitButton />
    </FormContainer>
  );
};
