import { useConnect } from 'reef-knot/core-react';

import { ConnectWalletButton } from 'features/home/styles';

export const ConnectWallet = () => {
  const { connect } = useConnect();

  const handleConnect = () => {
    void connect();
  };

  return (
    <ConnectWalletButton
      variant="outlined"
      color="secondary"
      size="lg"
      onClick={handleConnect}
    >
      Connect wallet to create a vault
    </ConnectWalletButton>
  );
};
