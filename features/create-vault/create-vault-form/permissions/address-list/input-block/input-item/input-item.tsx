import { FC, KeyboardEvent, useEffect, useState } from 'react';
import {
  useFormContext,
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormTrigger,
  UseFormRegister,
} from 'react-hook-form';

import { Input } from '@lidofinance/lido-ui';
import { ButtonClose } from 'shared/components';
import { InputWrapper } from './styles';

import {
  PermissionKeys,
  VaultPermissionsType,
} from 'features/create-vault/types';
import { Address } from 'viem';

type ArrayFormKey = `roles.${PermissionKeys}.${number}.value`;

export interface InputItemProps {
  permission: string;
  index: number;
  remove: (index?: number | number[]) => void;
  register: UseFormRegister<{ roles: VaultPermissionsType }>;
  trigger: UseFormTrigger<{ roles: VaultPermissionsType }>;
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
  const [fieldError, setError] = useState<string>();
  const inputKey = `roles.${permission}.${index}.value` as ArrayFormKey;

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
      const values: { value: Address }[] = getValues(`roles.${permission}`);
      const output = await trigger(inputKey);
      if (output) {
        const value = (e.currentTarget || (e.target as HTMLInputElement)).value;
        setValue(
          `roles.${permission}.${values?.length ?? 0}`,
          {
            account: value,
            state: 'grant',
          },
          { shouldDirty: true },
        );
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
