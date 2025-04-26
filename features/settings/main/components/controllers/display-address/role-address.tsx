import { FC } from 'react';

import { AddressBadge } from 'shared/components';
import { AddressWrapper } from './styles';
import { RoleFieldSchema } from 'features/settings/main/types';
import { useFormContext } from 'react-hook-form';
import { VaultInfo } from 'types';

interface RoleAddressProps {
  role: RoleFieldSchema;
  roles: RoleFieldSchema[];
  vaultKey: keyof VaultInfo;
  index: number;
}

export const RoleAddress: FC<RoleAddressProps> = ({
  role,
  vaultKey,
  roles,
  index,
}) => {
  const { getValues, setValue } = useFormContext();
  if (!('isGranted' in role)) {
    return null;
  }

  const toRemove = role.state === 'remove';
  const bgColor = toRemove ? 'error' : 'default';
  const isLast = roles.filter((role) => role.state === 'display').length === 1;
  const canToggle = (roles.length > 1 && !isLast) || toRemove;

  const onToggle = (index: number) => {
    const itemKey = `${vaultKey}.${index}`;
    const { value, state, isGranted } = getValues(itemKey) as RoleFieldSchema;
    const updatedItem = {
      value,
      isGranted,
      state: state === 'display' ? 'remove' : 'display',
    };

    setValue(itemKey, updatedItem);
  };

  return (
    <AddressWrapper key={role.value}>
      <AddressBadge
        weight={400}
        address={role.value}
        crossedText={toRemove}
        bgColor={bgColor}
        symbols={21}
        onToggle={canToggle ? () => onToggle(index) : undefined}
      />
    </AddressWrapper>
  );
};
