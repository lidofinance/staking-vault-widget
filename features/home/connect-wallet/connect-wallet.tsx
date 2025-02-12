import { useConnect } from 'reef-knot/core-react';

import { Button } from '@lidofinance/lido-ui';

export const ConnectWallet = () => {
  const { connect } = useConnect();

  const handleConnect = () => {
    void connect();
  };

  return (
    <Button variant="outlined" color="secondary" onClick={handleConnect}>
      Connect wallet to create a vault
    </Button>
  );
};
