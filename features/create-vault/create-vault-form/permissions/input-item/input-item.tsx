import { FC, KeyboardEvent, useEffect, useState } from 'react';
import {
  UseFormRegisterReturn,
  RegisterOptions,
  useFormContext,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form';

import { Input } from '@lidofinance/lido-ui';
import { ButtonClose } from 'shared/components';
import { InputWrapper } from './styles';

export interface InputItemProps {
  permission: string;
  index: number;
  remove: (index?: number | number[]) => void;
  register: (name: string, options?: RegisterOptions) => UseFormRegisterReturn;
  trigger: (name?: string | string[]) => Promise<boolean>;
  error: Merge<FieldError, FieldErrorsImpl<{ value: string }>> | undefined;
}

export const InputItem: FC<InputItemProps> = ({
  permission,
  index,
  remove,
  register,
  trigger,
  error,
}) => {
  const { setValue, getValues } = useFormContext();
  const [fieldError, setError] = useState<string>('');
  const inputKey = `${permission}.${index}.value`;

  useEffect(() => {
    if (error?.value && (error.value as unknown as string) !== fieldError) {
      setError(error.value as unknown as string);
    }

    if (!error?.value && fieldError) {
      setError('');
    }
  }, [error?.value, fieldError]);

  const handleSaveValue = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const values: { value: string }[] = getValues(permission);
      const output = await trigger(inputKey);
      if (output) {
        const value = (e.currentTarget || (e.target as HTMLInputElement)).value;
        setValue(`${permission}.${values.length}`, value);
        remove(index);
      }
    }
  };

  return (
    <InputWrapper>
      <Input
        {...register(inputKey)}
        placeholder="Ethereum address"
        onKeyUp={handleSaveValue}
        error={fieldError}
      />

      <ButtonClose onClick={() => remove(index)} />
    </InputWrapper>
  );
};
