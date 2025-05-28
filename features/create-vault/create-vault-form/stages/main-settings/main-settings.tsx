import { MAIN_SETTINGS } from 'features/create-vault/consts';

import { SectionContainer } from 'features/create-vault/create-vault-form/styles';

import { CreateVaultInput } from './create-vault-input';
import { MainSettingsAction } from './main-settings-action';

type MainSettingsProps = {
  isShown: boolean;
};

export const MainSettings = ({ isShown }: MainSettingsProps) => {
  return (
    <SectionContainer isShown={isShown}>
      {MAIN_SETTINGS.map((field) => (
        <CreateVaultInput key={field.name} {...field} />
      ))}
      <MainSettingsAction />
    </SectionContainer>
  );
};
