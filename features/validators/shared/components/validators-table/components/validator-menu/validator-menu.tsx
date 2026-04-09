import { ButtonIcon, PopupMenu } from '@lidofinance/lido-ui';

import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg';

import {
  useValidatorMenuVisibility,
  useValidatorMenuActions,
} from 'features/validators/shared/hooks';

import { ValidatorMenuAction } from './validator-menu-action';

export const ValidatorMenu = () => {
  const { popupVisible, ref, openPopup, closePopup } =
    useValidatorMenuVisibility();
  const actions = useValidatorMenuActions();

  return (
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
            hasPermission={hasPermission}
            onPopupClose={closePopup}
          />
        ))}
      </PopupMenu>
    </>
  );
};
