import {
  CREATE_VAULT_ADDRESSES,
  CREATE_VAULT_SETTINGS,
} from 'features/create-vault/consts';

import { SectionContainer } from 'features/create-vault/create-vault-form/styles';

import { CreateVaultInput } from './create-vault-input';
import { MainSettingsAction } from './main-settings-action';
import { GroupHeading, GroupWrapper, InputGroup } from './styles';
import { ConnectionDeposit } from './create-vault-input/connection-deposit';
import { AcceptTerms } from './create-vault-input/accept-terms';

type MainSettingsProps = {
  isShown: boolean;
};

export const MainSettings = ({ isShown }: MainSettingsProps) => {
  return (
    <SectionContainer isShown={isShown}>
      <GroupWrapper>
        <GroupHeading as="h3">Addresses</GroupHeading>
        <InputGroup>
          {CREATE_VAULT_ADDRESSES.map((field) => (
            <CreateVaultInput
              key={field.name}
              {...field}
              dataTestId={`createVault-${field.name}`}
            />
          ))}
        </InputGroup>
      </GroupWrapper>
      <GroupWrapper>
        <GroupHeading as="h3">Settings</GroupHeading>
        <InputGroup>
          {CREATE_VAULT_SETTINGS.map((field) => (
            <CreateVaultInput
              key={field.name}
              {...field}
              dataTestId={`createVault-${field.name}`}
            />
          ))}
        </InputGroup>
      </GroupWrapper>
      <ConnectionDeposit />
      <AcceptTerms />
      <MainSettingsAction />
    </SectionContainer>
  );
};
