import { ConfirmationAction } from 'features/create-vault/create-vault-form/confirmation/confirmation-action';
import { ConfirmationWrapper } from './styles';
import { ConfirmationVaultInfo } from 'features/create-vault/create-vault-form/confirmation/confirmation-vault-info';
import { useCreateVaultFormData } from '../create-vault-form-context';

export const Confirmation = () => {
  const { step } = useCreateVaultFormData();

  return (
    <ConfirmationWrapper step={step}>
      <ConfirmationVaultInfo />
      <ConfirmationAction />
    </ConfirmationWrapper>
  );
};
