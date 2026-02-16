import type { FC } from 'react';

import { useVault } from 'modules/vaults';

import { NavigationLink } from 'shared/components/layout/navigation/components';
import type { NavigationRoutes } from 'shared/components/layout/navigation/types';

type NavigationsProps = {
  routes: (NavigationRoutes & { pathname?: string })[];
};

export const NavigationList: FC<NavigationsProps> = ({ routes }) => {
  const { activeVault } = useVault();

  if (!activeVault) {
    return null;
  }

  return (
    <>
      {routes.map(({ title, path, icon, pathname, external }) => {
        const isValidatorsLink = title === 'Validators';
        const appPath =
          isValidatorsLink && activeVault
            ? `${path}${activeVault?.withdrawalCredentials}`
            : path;

        return (
          <NavigationLink
            key={path}
            icon={icon}
            title={title}
            path={appPath}
            pathname={pathname}
            external={external}
          />
        );
      })}
    </>
  );
};
