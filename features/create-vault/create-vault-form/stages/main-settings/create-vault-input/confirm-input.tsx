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
          {props.label
            ?.split('\n')
            .map((item, index) => <span key={index}>{item}</span>)}
        </InfoList>
      }
      {...register(props.name, {
        onChange: () => void trigger(props.name, { shouldFocus: false }),
      })}
      data-testid={props.dataTestId ? `${props.dataTestId}-checkbox` : null}
    />
  );
};
