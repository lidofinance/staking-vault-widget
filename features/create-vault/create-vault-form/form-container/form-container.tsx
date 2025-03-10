import { FC, PropsWithChildren } from 'react';

import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Title, Wrapper, TitleBlock, TitleContainer } from './styles';
import { ToggleSwitch } from 'shared/components/toggle';

import { CREATE_VAULT_STEPS } from 'consts/vault-factory';

const steps: Record<number, string> = {
  '1': 'Main settings',
  '2': 'Permissions',
  '3': 'Confirmation',
};

const PermissionsToggleList = [
  {
    value: 'by_permission',
    label: 'by Permission',
  },
  {
    value: 'by_address',
    label: 'by address',
  },
];

export const FormContainer: FC<PropsWithChildren> = ({ children }) => {
  const { step } = useCreateVaultFormData();

  return (
    <Wrapper>
      <TitleContainer>
        <TitleBlock>
          <span>
            Step {step} of {CREATE_VAULT_STEPS}
          </span>
          <Title>{steps[step]}</Title>
        </TitleBlock>
        {step === 2 && (
          <ToggleSwitch
            options={PermissionsToggleList}
            defaultActive="by_permission"
            onToggleCb={() => {}}
          />
        )}
      </TitleContainer>
      {children}
    </Wrapper>
  );
};
