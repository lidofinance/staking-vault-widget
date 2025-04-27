import {
  FC,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { isAddress } from 'viem';
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
  useFieldArray,
  UseFormRegister,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';

import { Identicon, Input } from '@lidofinance/lido-ui';
import { ButtonClose } from 'shared/components';
import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';
import { InputWrapper } from './styles';
import {
  ManagersKeys,
  ManagersNewAddresses,
  RoleFieldSchema,
} from 'features/settings/main/types';

export interface InputItemProps {
  name: string;
  editLabel: string;
  index: number;
  remove: (index?: number | number[]) => void;
  register: UseFormRegister<{ addresses: Record<string, RoleFieldSchema[]> }>;
  trigger: UseFormTrigger<{ addresses: Record<string, RoleFieldSchema[]> }>;
  watch: UseFormWatch<ManagersNewAddresses>;
  error: Merge<FieldError, FieldErrorsImpl<{ value: string }[]>> | undefined;
}

export const InputItem: FC<InputItemProps> = ({
  name,
  editLabel,
  index,
  remove,
  register,
  trigger,
  watch,
  error,
}) => {
  const [decorator, setDecorator] = useState<ReactNode | null>();
  const { control, setValue, getValues } = useFormContext();
  const { remove: removeFromMain } = useFieldArray({ control, name });
  const inputKey =
    `addresses.${name}.${index}.value` as `addresses.${ManagersKeys}.${number}.value`;
  const field = register(inputKey);
  const fieldValue = watch(inputKey);
  const errorText = error?.[index]?.value?.message ?? '';

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const values: RoleFieldSchema[] = getValues(name);
      const output = await trigger(inputKey);

      if (output) {
        const value = (e.currentTarget || (e.target as HTMLInputElement)).value;
        setValue(
          `${name}.${values?.length ?? 0}`,
          {
            account: value,
            state: 'grant',
          },
          { shouldDirty: true },
        );
      }
    }
  };

  const handleBlur = async (e: FocusEvent<HTMLInputElement>) => {
    const value = (e.currentTarget || e.target).value;
    const output = await trigger(inputKey);

    if (isAddress(value) && output) {
      const values: RoleFieldSchema[] = getValues(name);
      const output = await trigger(inputKey);
      if (output) {
        setValue(
          `${name}.${values?.length ?? 0}`,
          {
            value: value,
            state: 'grant',
          } as RoleFieldSchema,
          { shouldDirty: true },
        );
      }
    } else {
      void field.onBlur(e);
    }
  };

  const removeFieldItem = async () => {
    const output = await trigger(inputKey);
    const values: RoleFieldSchema[] = getValues(name);
    const mainFormItemIndex = values.findIndex(
      (item) => item.value === fieldValue,
    );
    if (mainFormItemIndex > -1 && output) {
      removeFromMain(mainFormItemIndex);
    }
    remove(index);
  };

  useEffect(() => {
    const getDecorator = async () => {
      const output = await trigger(inputKey);
      if (!output) setDecorator(<ErrorTriangle />);
      else if (isAddress(fieldValue) && output)
        setDecorator(<Identicon address={fieldValue} />);
      else setDecorator(null);
    };

    void getDecorator();
  }, [fieldValue, trigger, inputKey]);

  return (
    <InputWrapper>
      <Input
        {...field}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        leftDecorator={decorator}
        label={editLabel}
        error={errorText}
      />
      <ButtonClose onClick={removeFieldItem} />
    </InputWrapper>
  );
};
