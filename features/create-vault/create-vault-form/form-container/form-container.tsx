import { FC, PropsWithChildren } from 'react';

import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Title, Wrapper, TitleBlock, TitleContainer } from './styles';
import { ToggleSwitch } from 'shared/components/toggle';

import {
  getSectionNameByStep,
  permissionsToggleList,
  CREATE_VAULT_STEPS,
  ToggleValue,
  PermissionToggleEnum,
} from 'features/create-vault/consts';

export const FormContainer: FC<PropsWithChildren> = ({ children }) => {
  const { step, handleSetPermissionsView } = useCreateVaultFormData();

  return (
    <Wrapper>
      <TitleContainer>
        <TitleBlock>
          <span>
            Step {step} of {CREATE_VAULT_STEPS}
          </span>
          <Title>{getSectionNameByStep(step)}</Title>
        </TitleBlock>
        {step === 2 && (
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
