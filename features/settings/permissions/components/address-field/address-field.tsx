import { FC, useMemo } from 'react';

import { AddressBadge, AddressBadgeSelectable } from 'shared/components';

import {
  FieldSchema,
  PermissionFormField,
} from 'features/settings/permissions/types';
import { useController } from 'react-hook-form';

export type AddressItemProps = {
  index: number;
  permissionFormField: PermissionFormField;
  onUpdate: (field: FieldSchema, index: number) => void;
  onRemove: (index: number) => void;
  readonly?: boolean;
  dataTestId?: string;
};

export const AddressField: FC<AddressItemProps> = ({
  index,
  permissionFormField,
  onUpdate,
  onRemove,
  readonly,
  dataTestId,
}) => {
  const {
    field: { value },
  } = useController({ name: `${permissionFormField}.${index}` });
  const { account, action } = value as FieldSchema;
  const isChecked = action === 'revoke';

  const bgColor = useMemo(() => {
    if (isChecked) return 'error';
    if (action === 'grant') return 'success';
    return 'default';
  }, [isChecked, action]);

  const handleChangeField = () => {
    switch (action) {
      case 'grant':
        onRemove(index);
        break;
      case 'display':
        onUpdate({ account, action: 'revoke' }, index);
        break;
      case 'revoke':
        onUpdate({ account, action: 'display' }, index);
        break;
    }
  };

  if (readonly) {
    return (
      <AddressBadge address={account} dataTestId={dataTestId} showPopover />
    );
  }

  return (
    <AddressBadgeSelectable
      address={account}
      checked={isChecked}
      bgColor={bgColor}
      onCheckedChange={handleChangeField}
      dataTestId={dataTestId}
      showPopover
    />
  );
};
