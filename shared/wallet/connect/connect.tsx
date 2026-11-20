import { FC, useCallback } from 'react';
import { useConnectionFlow } from 'reef-knot';
import { Button, ButtonProps } from '@lidofinance/lido-ui';

import { useUserConfig } from 'config/user-config';

export const Connect: FC<ButtonProps> = (props) => {
  const { isWalletConnectionAllowed } = useUserConfig();
  const { onClick, ...rest } = props;
  const { startConnection } = useConnectionFlow();

  const handleClick = useCallback(() => {
    if (!isWalletConnectionAllowed) return;
    void startConnection();
  }, [isWalletConnectionAllowed, startConnection]);

  return (
    <Button
      {...rest}
      disabled={!isWalletConnectionAllowed}
      onClick={handleClick}
      data-testid="connectBtn"
    >
      Connect wallet
    </Button>
  );
};
