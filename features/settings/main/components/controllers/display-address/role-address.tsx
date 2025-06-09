import { FC, useMemo } from 'react';

import { AddressBadge, AddressBadgeSelectable } from 'shared/components';

import { AddressWrapper } from './styles';

import { RoleFieldSchema } from 'features/settings/main/types';

interface RoleAddressProps {
  index: number;
  isEditable: boolean;
  field: RoleFieldSchema;
  isLastField: boolean;
  hasMultipleValues: boolean;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: RoleFieldSchema) => void;
}

export const RoleAddress: FC<RoleAddressProps> = ({
  index,
  isEditable,
  field,
  isLastField,
  hasMultipleValues,
  onRemove,
  onUpdate,
}) => {
  const { state } = field;
  const toRemove = state === 'remove';
  const toGrant = state === 'grant';
  const canToggle = (hasMultipleValues && !isLastField) || toRemove || toGrant;

  const onToggle = () => {
    if (toGrant) {
      onRemove(index);
      return;
    }

    onUpdate(index, {
      ...field,
      state: state === 'display' ? 'remove' : 'display',
    });
  };

  const bgColor = useMemo(() => {
    if (toRemove) return 'error';
    if (state === 'grant') return 'success';
    return 'default';
  }, [toRemove, state]);

  return (
    <AddressWrapper>
      {canToggle && isEditable ? (
        <AddressBadgeSelectable
          weight={400}
          address={field.value}
          checked={toRemove}
          defaultBg={bgColor}
          onCheckedChange={onToggle}
          symbols={21}
        />
      ) : (
        <AddressBadge
          weight={400}
          address={field.value}
          crossed={toRemove}
          bgColor={bgColor}
          symbols={21}
        />
      )}
    </AddressWrapper>
  );
};
