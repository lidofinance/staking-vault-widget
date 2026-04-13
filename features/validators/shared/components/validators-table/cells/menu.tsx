import type { FC } from 'react';
import { Td, PopupMenu, ButtonIcon } from '@lidofinance/lido-ui';

import type { ValidatorsEntry } from 'modules/vaults';
import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg';

import { ValidatorMenuAction } from '../components';

import {
  useValidatorMenuActions,
  useValidatorMenuVisibility,
} from '../../../hooks';

type MenuCellProps = {
  validator: ValidatorsEntry;
};

export const MenuCell: FC<MenuCellProps> = ({ validator }) => {
  const { popupVisible, ref, openPopup, closePopup } =
    useValidatorMenuVisibility();
  const actions = useValidatorMenuActions();

  return (
    <Td>
      <>
        <ButtonIcon
          ref={ref}
          color="secondary"
          icon={<MenuIcon />}
          size="xs"
          variant="ghost"
          onClick={openPopup}
        />
        <PopupMenu
          anchorRef={ref}
          open={popupVisible}
          onClose={closePopup}
          style={{
            width: 160,
          }}
          variant="default"
        >
          {actions.map(({ label, modal, hasPermission }) => (
            <ValidatorMenuAction
              key={modal}
              label={label}
              modal={modal}
              validator={validator}
              hasPermission={hasPermission}
              onPopupClose={closePopup}
            />
          ))}
        </PopupMenu>
      </>
    </Td>
  );
};
