import { Balance } from './balance';
import { FormInput } from './form-input';
import { MintStETH } from './mint-steth';
import { SubmitButton } from './submit-button';
import { FeatureTxInfo } from './feature-tx-info';
import { FormContainer } from './styles';

export const Form = () => {
  return (
    <FormContainer>
      <Balance />
      <FormInput />
      <MintStETH />
      <SubmitButton />
      <FeatureTxInfo />
    </FormContainer>
  );
};
