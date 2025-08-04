import { ChangeEvent, useId, forwardRef } from 'react';
import { Close } from '@lidofinance/lido-ui';
import { ReactComponent as RestoreIcon } from 'assets/icons/restore.svg';

import { AddressBadge, AddressBadgeProps } from './address-badge';

import { SelectableWrapper, HiddenCheckbox, Label } from './styles';

export type SelectableAddressBadgeProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  defaultBg?: AddressBadgeProps['bgColor'];
} & Omit<AddressBadgeProps, 'crossed' | 'bgColor'>;

export const AddressBadgeSelectable = forwardRef<
  HTMLDivElement | null,
  SelectableAddressBadgeProps
>(
  (
    {
      checked,
      onCheckedChange,
      defaultBg = 'default',
      dataTestId,
      ...badgeProps
    },
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
          dataTestId={dataTestId}
        />

        <Label
          htmlFor={id}
          data-testid={dataTestId ? `${dataTestId}-actionButtonLabel` : null}
        >
          <HiddenCheckbox
            id={id}
            type="checkbox"
            checked={checked}
            onChange={handleInputChange}
          />
          {checked ? (
            <RestoreIcon
              data-testid={dataTestId ? `${dataTestId}-restoreIcon` : null}
            />
          ) : (
            <Close
              data-testid={dataTestId ? `${dataTestId}-closeIcon` : null}
            />
          )}
        </Label>
      </SelectableWrapper>
    );
  },
);
