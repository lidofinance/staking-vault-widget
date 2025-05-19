import { useFormContext, useFormState } from 'react-hook-form';

import { InfoList, StyledCheckbox, Wrapper } from './styles';

import type { CreateVaultSchema } from 'features/create-vault/types';

export const ConfirmTerms = () => {
  const { trigger, register } = useFormContext<CreateVaultSchema>();

  const { errors } = useFormState<CreateVaultSchema>({ name: 'acceptTerms' });

  const isError = !!errors.acceptTerms;

  return (
    <Wrapper>
      <StyledCheckbox
        isError={isError}
        label={
          <InfoList>
            <span>I confirm that I&apos;ve read and agree:</span>
            <span>&ensp;&bull; with the fees structure</span>
            <span>&ensp;&bull; mechanisms applied in extreme scenarios</span>
          </InfoList>
        }
        {...register('acceptTerms', {
          onChange: () => void trigger('acceptTerms', { shouldFocus: false }),
        })}
      />
    </Wrapper>
  );
};
