import { Balance } from './balance';
import { AmountField } from './amount-field';
import { SubmitButton } from './submit-button';
import { FeatureTxInfo } from './feature-tx-info';
import { FormContainer } from './styles';
import { AddressField } from './address-field/address-field';

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
