import { Balance } from './balance';
import { SubmitButton } from './submit-button';
import { FeatureTxInfo } from './feature-tx-info';
import { FormContainer } from './styles';
import { AddressField } from './address-field';

export const ClaimForm = () => {
  return (
    <FormContainer>
      <Balance />
      <AddressField />
      <SubmitButton />
      <FeatureTxInfo />
    </FormContainer>
  );
};
