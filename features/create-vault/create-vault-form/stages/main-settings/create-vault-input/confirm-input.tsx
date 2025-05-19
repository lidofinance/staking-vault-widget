import { useFormContext, useFormState } from 'react-hook-form';

import { InfoList, StyledCheckbox } from './styles';

import type { GeneralInputProps } from './general-input';
import type { CreateVaultSchema } from 'features/create-vault/types';

export const ConfirmInput = (props: GeneralInputProps) => {
  const { trigger, register } = useFormContext<CreateVaultSchema>();

  const { errors } = useFormState<CreateVaultSchema>({ name: props.name });

  const isError = !!errors.acceptTerms;

  return (
    <StyledCheckbox
      isError={isError}
      label={
        <InfoList>
          <span>I confirm that I&apos;ve read and agree:</span>
          <span>&ensp;&bull; with the fees structure</span>
          <span>&ensp;&bull; mechanisms applied in extreme scenarios</span>
        </InfoList>
      }
      {...register(props.name, {
        onChange: () => void trigger(props.name, { shouldFocus: false }),
      })}
    />
  );
};
