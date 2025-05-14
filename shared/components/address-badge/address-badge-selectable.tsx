import React, { FC, ChangeEvent, useId, forwardRef } from 'react';
import { AddressBadge, AddressBadgeProps } from 'shared/components/index';
import { Close } from '@lidofinance/lido-ui';
import { ReactComponent as RestoreIcon } from 'assets/icons/restore.svg';

import { SelectableWrapper, HiddenCheckbox, Label } from './styles';

export interface SelectableAddressBadgeProps
  extends Omit<AddressBadgeProps, 'crossed' | 'bgColor'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  defaultBg?: AddressBadgeProps['bgColor'];
}

export const AddressBadgeSelectable: FC<SelectableAddressBadgeProps> =
  forwardRef<HTMLDivElement | null, SelectableAddressBadgeProps>(
    (
      { checked, onCheckedChange, defaultBg = 'default', ...badgeProps },
      ref,
    ) => {
      const id = useId();

      const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onCheckedChange(e.target.checked);
      };

      return (
        <SelectableWrapper crossed={checked} bgColor={defaultBg}>
          <AddressBadge
            ref={ref}
            {...badgeProps}
            bgColor="transparent"
            crossed={checked}
          />

          <Label htmlFor={id}>
            <HiddenCheckbox
              id={id}
              type="checkbox"
              checked={checked}
              onChange={handleInputChange}
            />
            {checked ? <RestoreIcon /> : <Close />}
          </Label>
        </SelectableWrapper>
      );
    },
  );
