import { useDappStatus } from 'modules/web3';

import { useConnect } from 'reef-knot/core-react';

import { MyVaultsTable } from 'features/home/my-vaults/my-vaults-table';
import { Wrapper, ConnectWalletButton } from './styles';

export const MyVaults = () => {
  const { isWalletConnected } = useDappStatus();
  const { connect } = useConnect();

  const handleConnect = () => {
    void connect();
  };

  return (
    <Wrapper>
      {isWalletConnected ? (
        <MyVaultsTable />
      ) : (
        <ConnectWalletButton
          variant="outlined"
          color="secondary"
          size="lg"
          onClick={handleConnect}
        >
          Connect wallet to create a vault
        </ConnectWalletButton>
      )}
    </Wrapper>
  );
};
