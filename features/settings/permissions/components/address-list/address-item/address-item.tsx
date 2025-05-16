import { FC, useMemo } from 'react';

import { AddressBadge, AddressPopoverSelectable } from 'shared/components';

import {
  EditPermissionsSchema,
  FieldSchema,
} from 'features/settings/permissions/types';
import { FieldArrayWithId, UseFieldArrayUpdate } from 'react-hook-form';

export type AddressItemProps = {
  index: number;
  field: FieldArrayWithId<FieldSchema>;
  update: UseFieldArrayUpdate<EditPermissionsSchema>;
  readonly?: boolean;
};

export const AddressItem: FC<AddressItemProps> = ({
  index,
  field,
  update,
  readonly,
}) => {
  const { account, state, group } = field as Record<'id', string> & FieldSchema;
  const isChecked = useMemo(
    () => ['restore', 'remove'].includes(state),
    [state],
  );

  const bgColor = useMemo(() => {
    if (isChecked) return 'error';
    if (state === 'grant') return 'success';
    return 'default';
  }, [isChecked, state]);

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
