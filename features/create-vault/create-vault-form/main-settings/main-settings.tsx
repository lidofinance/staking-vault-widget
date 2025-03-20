import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { GeneralInput } from 'features/create-vault/create-vault-form/form-controllers';
import { Confirmation } from 'features/create-vault/create-vault-form/main-settings/confirmation';
import { MainSettingsAction } from 'features/create-vault/create-vault-form/main-settings/main-settings-action';
import { SectionContainer } from 'features/create-vault/styles';

import { getCreateVaultFields } from 'features/create-vault/consts';

const fieldsForRender = getCreateVaultFields([
  'nodeOperator',
  'assetRecoverer',
  'nodeOperatorFeeBP',
  'curatorFeeBP',
  'confirmExpiry',
  'defaultAdmin',
  'nodeOperatorManager',
]);

export const MainSettings = () => {
  const { step } = useCreateVaultFormData();

  return (
    <SectionContainer step={step} currentStep={1}>
      {fieldsForRender.map((field) => (
        <GeneralInput key={field.name} {...field} />
      ))}
      <Confirmation />
      <MainSettingsAction />
    </SectionContainer>
  );
};
