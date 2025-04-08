import { Balance } from './balance';
import { FormInput } from './form-input';
import { SubmitButton } from './submit-button';
import { FeatureTxInfo } from './feature-tx-info';
import { FormContainer } from './styles';

export const RepayForm = () => {
  return (
    <FormContainer>
      <Balance />
      <FormInput />
      <SubmitButton />
      <FeatureTxInfo />
    </FormContainer>
  );
};
