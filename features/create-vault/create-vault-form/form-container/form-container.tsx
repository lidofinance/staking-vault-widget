import { FC, PropsWithChildren } from 'react';

import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Title, TitleBlock, TitleContainer, Wrapper } from './styles';
import { ToggleSwitch } from 'shared/components/toggle';

import {
  CREATE_VAULT_FORM_STEPS,
  CREATE_VAULT_STEPS,
  getSectionNameByStep,
  permissionsToggleList,
  PermissionToggleEnum,
  ToggleValue,
} from 'features/create-vault/consts';

export const FormContainer: FC<PropsWithChildren> = ({ children }) => {
  const { step, handleSetPermissionsView } = useCreateVaultFormData();

  return (
    <Wrapper>
      <TitleContainer>
        <TitleBlock>
          <span>
            Step {step + 1} of {CREATE_VAULT_STEPS}
          </span>
          <Title>{getSectionNameByStep(step)}</Title>
        </TitleBlock>
        {step === CREATE_VAULT_FORM_STEPS.permissions && (
          <ToggleSwitch
            options={permissionsToggleList}
            defaultActive={PermissionToggleEnum.byPermission}
            onToggle={({ value }) =>
              handleSetPermissionsView(value as ToggleValue)
            }
          />
        )}
      </TitleContainer>
      {children}
    </Wrapper>
  );
};
