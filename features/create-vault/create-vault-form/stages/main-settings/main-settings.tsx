import { InputResolver } from 'features/create-vault/create-vault-form/form-controllers';
import { Confirmation } from 'features/create-vault/create-vault-form/stages/main-settings/confirmation';
import { MainSettingsAction } from 'features/create-vault/create-vault-form/stages/main-settings/main-settings-action';

import { MAIN_SETTINGS } from 'features/create-vault/consts';

import { SectionContainer } from '../../styles';

type MainSettingsProps = {
  isShown: boolean;
};

export const MainSettings = ({ isShown }: MainSettingsProps) => {
  return (
    <SectionContainer isShown={isShown}>
      {MAIN_SETTINGS.map((field) => (
        <InputResolver key={field.name} {...field} />
      ))}
      <Confirmation />
      <MainSettingsAction />
    </SectionContainer>
  );
};
