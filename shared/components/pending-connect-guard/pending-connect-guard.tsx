import type { FC, PropsWithChildren, ReactNode } from 'react';

import { useVault } from 'modules/vaults';

type PendingConnectGuardProps = {
  fallback?: ReactNode;
};

export const PendingConnectGuard: FC<
  PropsWithChildren<PendingConnectGuardProps>
> = ({ children, fallback = null }) => {
  const { activeVault } = useVault();

  if (activeVault?.isPendingConnect) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
