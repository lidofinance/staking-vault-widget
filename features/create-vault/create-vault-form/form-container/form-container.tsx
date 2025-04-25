import { FC, PropsWithChildren } from 'react';

import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Title, TitleBlock, TitleContainer, Wrapper } from './styles';

import {
  CREATE_VAULT_STEPS,
  getSectionNameByStep,
} from 'features/create-vault/consts';

export const FormContainer: FC<PropsWithChildren> = ({ children }) => {
  const { step } = useCreateVaultFormData();

  return (
    <Wrapper>
      <TitleContainer>
        <TitleBlock>
          <span>
            Step {step + 1} of {CREATE_VAULT_STEPS}
          </span>
          <Title>{getSectionNameByStep(step)}</Title>
        </TitleBlock>
      </TitleContainer>
      {children}
    </Wrapper>
  );
};
