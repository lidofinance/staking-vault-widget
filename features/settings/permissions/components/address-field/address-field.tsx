import { FC, useMemo } from 'react';

import { AddressBadge, AddressPopoverSelectable } from 'shared/components';

import {
  FieldSchema,
  PermissionKeys,
} from 'features/settings/permissions/types';
import { useController } from 'react-hook-form';

export type AddressItemProps = {
  index: number;
  permission: PermissionKeys;
  onUpdate: (field: FieldSchema, index: number) => void;
  onRemove: (index: number) => void;
  readonly?: boolean;
};

export const AddressField: FC<AddressItemProps> = ({
  index,
  permission,
  onUpdate,
  onRemove,
  readonly,
}) => {
  const {
    field: { value },
  } = useController({ name: `${permission}.${index}` });
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
    return <AddressBadge address={account} />;
  }

  return (
    <AddressPopoverSelectable
      address={account}
      checked={isChecked}
      bgColor={bgColor}
      onCheckedChange={handleChangeField}
    />
  );
};
