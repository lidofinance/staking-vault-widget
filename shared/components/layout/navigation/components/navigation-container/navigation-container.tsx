import type { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import { appPaths } from 'consts/routing';

import { Nav } from './styles';

// hide navigation on mobile create vault page
const pathForHide = appPaths.vaults.create;

export const NavigationContainer: FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useRouter();

  return <Nav $hide={pathname === pathForHide}>{children}</Nav>;
};
