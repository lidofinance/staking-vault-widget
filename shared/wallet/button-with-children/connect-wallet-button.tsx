import type { FC, PropsWithChildren } from 'react';
import { ButtonProps } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';
import { Connect } from 'shared/wallet';

export const ConnectWalletButton: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  ...rest
}) => {
  const { isWalletConnected } = useDappStatus();

  if (isWalletConnected) {
    return <>{children}</>;
  }

  return <Connect {...rest} fullwidth />;
};
