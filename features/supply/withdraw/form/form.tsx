import { Balance } from './balance';
import { AmountField } from './amount-field';
import { SubmitButton } from './submit-button';
import { FeatureTxInfo } from './feature-tx-info';
import { AddressField } from './address-field';
import { FormContainer } from './styles';

export const Form = () => {
  return (
    <FormContainer>
      <Balance />
      <AmountField />
      <AddressField />
      <SubmitButton />
      <FeatureTxInfo />
    </FormContainer>
  );
};
