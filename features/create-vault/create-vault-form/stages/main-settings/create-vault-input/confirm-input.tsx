import { InfoList, StyledCheckboxHookForm } from './styles';

import type { CreateFormInputProps } from './types';

export const ConfirmInput = (props: CreateFormInputProps) => {
  return (
    <StyledCheckboxHookForm
      fieldName={props.name}
      label={
        <InfoList>
          {props.label
            ?.split('\n')
            .map((item, index) => <span key={index}>{item}</span>)}
        </InfoList>
      }
      data-testid={
        props.dataTestId ? `${props.dataTestId}-checkbox` : undefined
      }
    />
  );
};
