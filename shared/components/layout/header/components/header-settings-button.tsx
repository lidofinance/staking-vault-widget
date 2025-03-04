import { useCallback } from 'react';

import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { AppPaths } from 'consts/urls';
import { useRouterPath } from 'shared/hooks/use-router-path';
import { usePrefixedPush } from 'shared/hooks/use-prefixed-history';

import { HeaderControlButton } from './header-control-button';

export const HeaderSettingsButton = () => {
  const push = usePrefixedPush();
  const route = useRouterPath();
  const handleClick = useCallback(() => push(AppPaths.settings), [push]);

  return (
    <HeaderControlButton
      isActive={route === AppPaths.settings}
      onClick={handleClick}
    >
      <GearIcon />
    </HeaderControlButton>
  );
};
