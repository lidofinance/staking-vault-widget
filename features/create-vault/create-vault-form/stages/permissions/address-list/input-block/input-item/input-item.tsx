import { FC, KeyboardEvent, FocusEvent, useEffect, useState } from 'react';
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
import { Address, isAddress } from 'viem';

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
  const field = register(inputKey);

  useEffect(() => {
    if (error?.value && (error.value as unknown as string) !== fieldError) {
      setError(error.value as unknown as string);
    }

    if (!error?.value && fieldError) {
      setError('');
    }
  }, [error?.value, fieldError]);

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
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

  const handleBlur = async (e: FocusEvent<HTMLInputElement>) => {
    const value = (e.currentTarget || e.target).value;

    if (isAddress(value)) {
      const values: { value: Address }[] = getValues(`roles.${permission}`);
      const output = await trigger(inputKey);
      if (output) {
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
    } else {
      void trigger(inputKey);
      void field.onBlur(e);
    }
  };

  return (
    <InputWrapper>
      <Input
        {...field}
        placeholder="Ethereum address"
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        error={fieldError}
      />

      <ButtonClose onClick={() => remove(index)} />
    </InputWrapper>
  );
};
