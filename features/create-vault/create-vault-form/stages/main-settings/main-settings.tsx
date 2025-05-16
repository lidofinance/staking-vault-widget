import { MAIN_SETTINGS } from 'features/create-vault/consts';

import { SectionContainer } from 'features/create-vault/create-vault-form/styles';
import { InputResolver } from 'features/create-vault/create-vault-form/form-controllers';

import { ConfirmTerms } from './confirm-terms';
import { MainSettingsAction } from './main-settings-action';

type MainSettingsProps = {
  isShown: boolean;
};

export const MainSettings = ({ isShown }: MainSettingsProps) => {
  return (
    <SectionContainer isShown={isShown}>
      {MAIN_SETTINGS.map((field) => (
        <InputResolver key={field.name} {...field} />
      ))}
      <ConfirmTerms />
      <MainSettingsAction />
    </SectionContainer>
  );
};
