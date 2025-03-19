import { FC } from 'react';
import { isAddress } from 'viem';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { useLidoSDK } from 'modules/web3';

import { Plus } from '@lidofinance/lido-ui';
import { InputItem } from './input-item';
import { AddAddress } from '../styles';
import { InputBlockWrapper } from './styles';

import { validateEnsDomain } from 'features/create-vault/create-vault-form/create-vault-form-context/validation';

export interface InputBlockProps {
  permission: string;
}

export const InputBlock: FC<InputBlockProps> = ({ permission }) => {
  const { getValues } = useFormContext();
  const { core } = useLidoSDK();

  const {
    control,
    register,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      [permission]: [],
    },
    // TODO: move resolver function to validator
    resolver: async (values) => {
      const errors = {} as Record<
        string,
        Record<string, Record<string, string>>
      >;
      const keysList = Object.keys(values);

      await Promise.all(
        keysList.map(async (key) => {
          const payload = values[key] as Record<'value', string>[];
          errors[key] = {};

          await Promise.all(
            payload.map(async (field, index) => {
              const currentValue = field.value;
              if (!isAddress(currentValue)) {
                const isValid = await validateEnsDomain(
                  currentValue,
                  core.rpcProvider,
                );
                if (!isValid) {
                  errors[key][index] = {
                    value: 'Invalid ethereum address',
                  };
                }
              }

              const mainFormValues = getValues(key) as string[];
              const filtered = mainFormValues.filter(
                (value) => value === currentValue,
              );
              if (filtered.length > 0) {
                errors[key][index] = {
                  value: 'Address already added',
                };
              }
            }),
          );
        }),
      );

      return {
        values,
        errors,
      };
    },
    mode: 'onBlur',
  });

  const { append, fields, remove } = useFieldArray({
    // @ts-expect-error empty initial array of fields to hide empty inputs on permission form section
    name: permission,
    control,
  });

  return (
    <InputBlockWrapper>
      {fields.map((field, index) => (
        <InputItem
          error={errors[permission]?.[index]}
          remove={remove}
          trigger={trigger}
          register={register}
          key={field.id}
          permission={permission}
          index={index}
        />
      ))}

      <AddAddress
        color="primary"
        icon={<Plus />}
        size="md"
        variant="ghost"
        type="button"
        onClick={() => append({ value: '' })}
      >
        Add new address
      </AddAddress>
    </InputBlockWrapper>
  );
};
