import { FC, useCallback } from 'react';
import { useFieldArray } from 'react-hook-form';

import { AddressField } from 'features/settings/permissions/components';
import { Wrapper } from './styles';

import {
  EditPermissionsSchema,
  FieldSchema,
  PermissionKeys,
} from 'features/settings/permissions/types';
import { InputBlock } from '../input-block';

export type AddressBlockProps = {
  permission: PermissionKeys;
  readonly?: boolean;
  dataTestId?: string;
};

export const AddressBlock: FC<AddressBlockProps> = ({
  permission,
  readonly,
  dataTestId,
}) => {
  const { fields, update, append, remove } =
    useFieldArray<EditPermissionsSchema>({
      name: permission,
    });

  const handleUpdateField = useCallback(
    (content: FieldSchema, index: number) => {
      update(index, content);
    },
    [update],
  );

  const handleRemoveField = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  return (
    <Wrapper
      data-testid={dataTestId ? `${dataTestId}-addressesWrapper` : undefined}
    >
      {fields.map((field, index) => {
        return (
          <AddressField
            key={field.id}
            index={index}
            readonly={readonly}
            permission={permission}
            onUpdate={handleUpdateField}
            onRemove={handleRemoveField}
            dataTestId={`${dataTestId}-${index}`}
          />
        );
      })}

      <InputBlock
        fields={fields}
        readonly={readonly}
        append={append}
        dataTestId={`${dataTestId}`}
      />
    </Wrapper>
  );
};
