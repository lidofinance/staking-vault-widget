import {
  CREATE_VAULT_ADDRESSES,
  CREATE_VAULT_FORM_STEPS,
} from 'features/create-vault/consts';

import {
  SectionContainer,
  SectionFields,
} from 'features/create-vault/create-vault-form/styles';
import { CreateVaultInput } from 'features/create-vault/create-vault-form/create-vault-input';
import { StepAction } from 'features/create-vault/create-vault-form/step-action';

type AddressesProps = {
  isShown: boolean;
};

export const Addresses = ({ isShown }: AddressesProps) => {
  return (
    <SectionContainer isShown={isShown}>
      <SectionFields>
        {CREATE_VAULT_ADDRESSES.map((field) => (
          <CreateVaultInput
            key={field.name}
            {...field}
            dataTestId={`createVault-${field.name}`}
          />
        ))}
      </SectionFields>
      <StepAction step={CREATE_VAULT_FORM_STEPS.addresses} />
    </SectionContainer>
  );
};
