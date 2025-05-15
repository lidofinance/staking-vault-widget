import { useFormContext, useFormState } from 'react-hook-form';

import { InfoList, StyledCheckbox, Wrapper } from './styles';

import { CreateVaultSchema } from 'features/create-vault/types';

export const ConfirmTerms = () => {
  const { trigger, register } = useFormContext<CreateVaultSchema>();

  const { errors } = useFormState<CreateVaultSchema>({ name: 'acceptTerms' });

  const isError = !!errors.acceptTerms;
  return (
    <Wrapper>
      <StyledCheckbox
        isError={isError}
        label={
          <>
            <p>I confirm that I&apos;ve read and agree:</p>
            <InfoList>
              <li>with the fees structure;</li>
              <li>mechanisms applied in extreme scenarios.</li>
            </InfoList>
          </>
        }
        {...register('acceptTerms', {
          onChange: () => void trigger('acceptTerms', { shouldFocus: false }),
        })}
      />
    </Wrapper>
  );
};
