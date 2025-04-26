import { FC, useMemo } from 'react';
import { isAddress } from 'viem';
import { useController, useFormContext } from 'react-hook-form';

import { Identicon, Input, Loader } from '@lidofinance/lido-ui';
import { ButtonClose } from 'shared/components';
import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';
import { InputWrapper } from './styles';

export interface InputItemProps {
  name: string;
  editLabel: string;
  index: number;
  remove: (index?: number | number[]) => void;
}

export const InputItem: FC<InputItemProps> = ({
  name,
  editLabel,
  index,
  remove,
}) => {
  const {
    getValues,
    formState: { errors },
  } = useFormContext();
  const inputKey = `${name}.${index}`;
  const { field, fieldState } = useController({ name: `${inputKey}.value` });

  // @ts-expect-error react-hook-form types incompatible to zod schema validation
  const errorMessage = errors?.[name]?.[index]?.value.message;

  const decorator = useMemo(() => {
    const { invalid, isDirty, isValidating } = fieldState;
    if (invalid) return <ErrorTriangle />;
    if (isValidating) return <Loader size="small" />;
    if (!isDirty) return null;
    if (isAddress(field.value)) return <Identicon address={field.value} />;

    return null;
  }, [field.value, fieldState]);

  if ('isGranted' in getValues(inputKey)) {
    return null;
  }

  return (
    <InputWrapper>
      <Input
        {...field}
        leftDecorator={decorator}
        label={editLabel}
        error={errorMessage}
      />
      <ButtonClose onClick={() => remove(index)} />
    </InputWrapper>
  );
};
