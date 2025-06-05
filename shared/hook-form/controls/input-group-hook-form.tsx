import styled from 'styled-components';
import { useFormState } from 'react-hook-form';
import { InputGroup } from '@lidofinance/lido-ui';

type InputGroupProps = React.ComponentProps<typeof InputGroup>;

type InputGroupHookFormProps = InputGroupProps & {
  errorField: string;
  showErrorMessage?: boolean;
};

const InputGroupStyled = styled(InputGroup)<{
  success?: InputGroupProps['success'];
}>`
  z-index: 2;
  span:nth-of-type(2) {
    white-space: ${({ success }) => !!success && 'unset'};
  }
`;

export const InputGroupHookForm: React.FC<InputGroupHookFormProps> = ({
  errorField,
  showErrorMessage = true,
  ...props
}) => {
  const { errors } = useFormState<Record<string, unknown>>({
    name: errorField,
  });
  const errorMessage = showErrorMessage && errors[errorField]?.message;
  return <InputGroupStyled fullwidth error={errorMessage} {...props} />;
};
