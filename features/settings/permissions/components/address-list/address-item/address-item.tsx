import { FC, useMemo, useEffect } from 'react';

import { AddressBadge, AddressPopoverSelectable } from 'shared/components';

import {
  EditPermissionsSchema,
  FieldSchema,
  PermissionKeys,
} from 'features/settings/permissions/types';
import {
  FieldArrayWithId,
  UseFieldArrayUpdate,
  useFormContext,
} from 'react-hook-form';

export type AddressItemProps = {
  index: number;
  field: FieldArrayWithId<FieldSchema>;
  permission: PermissionKeys;
  update: UseFieldArrayUpdate<EditPermissionsSchema>;
  readonly?: boolean;
};

export const AddressItem: FC<AddressItemProps> = ({
  index,
  field,
  permission,
  update,
  readonly,
}) => {
  const { register } = useFormContext();
  const { account, state, group } = field as Record<'id', string> & FieldSchema;
  const fieldKey = `${permission}.${index}.${account}` as const;
  const isChecked = useMemo(
    () => ['restore', 'remove'].includes(state),
    [state],
  );

  const bgColor = useMemo(() => {
    if (isChecked) return 'error';
    if (state === 'grant') return 'success';
    return 'default';
  }, [isChecked, state]);

  useEffect(() => {
    register(fieldKey);
  }, [register, fieldKey]);

  const handleUpdateFormItem = () => {
    let newState;
    if (group === 'settled') {
      newState = state === 'display' ? 'remove' : 'display';
    } else {
      newState = state === 'grant' ? 'restore' : 'grant';
    }

    update(index, { account, group, state: newState } as FieldSchema);
  };

  if (readonly) {
    return <AddressBadge address={account} />;
  }

  return (
    <AddressPopoverSelectable
      address={account}
      checked={isChecked}
      bgColor={bgColor}
      onCheckedChange={handleUpdateFormItem}
    />
  );
};
