import { useForm } from 'react-hook-form';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { InputResolver } from 'features/create-vault/create-vault-form/form-controllers';
import { Confirmation } from 'features/create-vault/create-vault-form/main-settings/confirmation';
import { MainSettingsAction } from 'features/create-vault/create-vault-form/main-settings/main-settings-action';
import { SectionContainer } from 'features/create-vault/styles';

import {
  CREATE_VAULT_FORM_STEPS,
  getCreateVaultFields,
  mainSettingsFields,
} from 'features/create-vault/consts';
import { VaultMainSettingsType } from 'features/create-vault/types';
import { validateMainSettings } from '../create-vault-form-context/validation';

const fieldsForRender = getCreateVaultFields(mainSettingsFields);

export const MainSettings = () => {
  const { step } = useCreateVaultFormData();

  const mainSettingsForm = useForm<VaultMainSettingsType>({
    defaultValues: {
      nodeOperator: '',
      assetRecoverer: '',
      nodeOperatorManager: '',
      nodeOperatorFeeBP: 5,
      curatorFeeBP: 5,
      confirmExpiry: 36,
      defaultAdmin: '',
      confirmMainSettings: false,
    },
    resolver: validateMainSettings,
    mode: 'all',
  });

  return (
    <SectionContainer step={step} currentStep={CREATE_VAULT_FORM_STEPS.main}>
      {fieldsForRender.map((field) => (
        <InputResolver form={mainSettingsForm} key={field.name} {...field} />
      ))}
      <Confirmation register={mainSettingsForm.register} />
      <MainSettingsAction form={mainSettingsForm} />
    </SectionContainer>
  );
};
