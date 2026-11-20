import {
  CREATE_VAULT_SETTINGS,
  CREATE_VAULT_FORM_STEPS,
} from 'features/create-vault/consts';

import {
  SectionContainer,
  SectionFields,
} from 'features/create-vault/create-vault-form/styles';
import { CreateVaultInput } from 'features/create-vault/create-vault-form/create-vault-input';
import { StepAction } from 'features/create-vault/create-vault-form/step-action';

type SettingsProps = {
  isShown: boolean;
};

export const Settings = ({ isShown }: SettingsProps) => {
  return (
    <SectionContainer isShown={isShown}>
      <SectionFields>
        {CREATE_VAULT_SETTINGS.map((field) => (
          <CreateVaultInput
            key={field.name}
            {...field}
            dataTestId={`createVault-${field.name}`}
          />
        ))}
      </SectionFields>
      <StepAction step={CREATE_VAULT_FORM_STEPS.settings} />
    </SectionContainer>
  );
};
