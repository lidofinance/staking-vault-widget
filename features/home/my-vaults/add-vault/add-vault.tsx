import { useRouter } from 'next/router';
import { useConnect } from 'reef-knot/core-react';
import { Plus } from '@lidofinance/lido-ui';

import { appPaths } from 'consts/routing';
import { useDappStatus } from 'modules/web3';

import { ConnectWalletButton, AddVaultButton } from './styles';

export const AddVault = () => {
  const router = useRouter();
  const { isWalletConnected } = useDappStatus();
  const { connect } = useConnect();

  const handleConnect = () => {
    void connect();
  };

  const handleNavigate = () => {
    void router.push(appPaths.vaults.create);
  };

  if (!isWalletConnected)
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

  return (
    <AddVaultButton
      variant="outlined"
      color="secondary"
      size="lg"
      icon={<Plus />}
      onClick={handleNavigate}
    >
      Create new Vault
    </AddVaultButton>
  );
};
