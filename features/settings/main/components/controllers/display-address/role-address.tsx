import { FC } from 'react';

import { AddressBadge, AddressBadgeSelectable } from 'shared/components';
import { AddressWrapper } from './styles';
import { RoleFieldSchema } from 'features/settings/main/types';
import { useFormContext } from 'react-hook-form';
import { VaultInfo } from 'types';

interface RoleAddressProps {
  vaultKey: keyof VaultInfo;
  index: number;
  isEditable: boolean;
  role: RoleFieldSchema;
  roles: RoleFieldSchema[];
}

export const RoleAddress: FC<RoleAddressProps> = ({
  vaultKey,
  index,
  isEditable,
  role,
  roles,
}) => {
  const { getValues, setValue } = useFormContext();
  const itemFormKey = `${vaultKey}.${index}`;
  if (!('isGranted' in role)) {
    return null;
  }

  const toRemove = role.state === 'remove';
  const isLast = roles.filter((role) => role.state === 'display').length === 1;
  const canToggle = (roles.length > 1 && !isLast) || toRemove;
  const onToggle = () => {
    const { state, ...rest } = getValues(itemFormKey) as RoleFieldSchema;
    const updatedItem = {
      ...rest,
      state: state === 'display' ? 'remove' : 'display',
    };

    setValue(itemFormKey, updatedItem, { shouldDirty: true });
  };

  return (
    <AddressWrapper>
      {canToggle && isEditable ? (
        <AddressBadgeSelectable
          weight={400}
          address={role.value}
          checked={toRemove}
          defaultBg="default"
          onCheckedChange={onToggle}
          symbols={21}
        />
      ) : (
        <AddressBadge
          weight={400}
          address={role.value}
          crossed={toRemove}
          bgColor="default"
          symbols={21}
        />
      )}
    </AddressWrapper>
  );
};
