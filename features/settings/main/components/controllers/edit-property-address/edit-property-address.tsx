import { FC, useEffect } from 'react';

import { useFieldArray, useForm, useFormContext } from 'react-hook-form';

import { Plus } from '@lidofinance/lido-ui';
import { InputItem } from './input-item';
import { ButtonContainer, EditWrapper } from './styles';
import {
  ManagersKeys,
  ManagersNewAddresses,
} from 'features/settings/main/types';
import { Address } from 'viem';
import { validateManagers } from 'features/settings/main/consts';
import { useVaultInfo } from 'features/overview/contexts';

interface EditPropertyAddressProps {
  name: ManagersKeys;
  editLabel: string;
}

export const EditPropertyAddress: FC<EditPropertyAddressProps> = ({
  name,
  editLabel,
}) => {
  const { isRefetching } = useVaultInfo();
  const { getValues } = useFormContext();
  const {
    control,
    register,
    trigger,
    watch,
    formState: { errors },
    getFieldState,
  } = useForm<ManagersNewAddresses>({
    defaultValues: {
      addresses: {
        [name]: [],
      },
    },
    resolver: validateManagers(getValues),
    mode: 'all',
  });
  const { append, fields, remove } = useFieldArray({
    control,
    name: `addresses.${name}`,
  });

  useEffect(() => {
    if (isRefetching) {
      remove();
    }
  }, [remove, isRefetching]);

  return (
    <EditWrapper>
      {fields.map((field, index) => {
        return (
          <InputItem
            name={name}
            editLabel={editLabel}
            key={field.id}
            register={register}
            remove={remove}
            trigger={trigger}
            watch={watch}
            error={errors.addresses?.[name]}
            index={index}
            getFieldState={getFieldState}
          />
        );
      })}
      <ButtonContainer
        color="primary"
        icon={<Plus />}
        size="md"
        variant="ghost"
        type="button"
        onClick={() => append({ value: '' as Address, state: 'grant' })}
      >
        Add new address
      </ButtonContainer>
    </EditWrapper>
  );
};
