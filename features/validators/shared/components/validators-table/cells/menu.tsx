import type { FC } from 'react';
import { PopupMenu, ButtonIcon } from '@lidofinance/lido-ui';

import type { ValidatorsEntry } from 'modules/vaults';
import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg';
import { useMatchMedia } from 'shared/hooks';
import { NAV_MOBILE_MAX_WIDTH } from 'styles/constants';

import { ValidatorMenuAction } from '../components';

import { TdStyled } from './styles';

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
  const { isMatched } = useMatchMedia(NAV_MOBILE_MAX_WIDTH);
  const popupPlacement = isMatched ? 'leftBottom' : 'bottomLeft';

  return (
    <TdStyled>
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
          placement={popupPlacement}
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
    </TdStyled>
  );
};
