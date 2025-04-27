import { FC } from 'react';

import { AddressBadge } from 'shared/components';
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
  const bgColor = toRemove ? 'error' : 'default';
  const isLast = roles.filter((role) => role.state === 'display').length === 1;
  const canToggle = (roles.length > 1 && !isLast) || toRemove;
  const onToggle = () => {
    const { value, state, isGranted } = getValues(
      itemFormKey,
    ) as RoleFieldSchema;
    const updatedItem = {
      value,
      isGranted,
      state: state === 'display' ? 'remove' : 'display',
    };

    setValue(itemFormKey, updatedItem, { shouldDirty: true });
  };

  return (
    <AddressWrapper>
      <AddressBadge
        weight={400}
        address={role.value}
        crossedText={toRemove}
        bgColor={bgColor}
        symbols={21}
        onToggle={canToggle && isEditable ? () => onToggle() : undefined}
      />
    </AddressWrapper>
  );
};
