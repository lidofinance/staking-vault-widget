import type { FC } from 'react';

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
  dataTestId?: string;
}

const badgeBackgrounds = {
  display: 'default',
  grant: 'success',
  remove: 'error',
} as const;

export const RoleAddress: FC<RoleAddressProps> = ({
  index,
  isEditable,
  field,
  isLastField,
  hasMultipleValues,
  onRemove,
  onUpdate,
  dataTestId,
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

  const bgColor = badgeBackgrounds[state];
  const badgeProps = {
    address: field.value,
    symbols: 21,
    dataTestId,
    showPopover: true,
  };

  return (
    <AddressWrapper
      data-testid={dataTestId ? `${dataTestId}-addressWrapper` : undefined}
    >
      {canToggle && isEditable ? (
        <AddressBadgeSelectable
          {...badgeProps}
          checked={toRemove}
          defaultBg={bgColor}
          onCheckedChange={onToggle}
        />
      ) : (
        <AddressBadge {...badgeProps} crossed={toRemove} bgColor={bgColor} />
      )}
    </AddressWrapper>
  );
};
