import { Plus } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';

import { useCreateVaultActions } from '../use-create-vault-actions';
import { ConnectWalletButton, AddVaultButton } from './styles';

export const AddVault = () => {
  const { isWalletConnected } = useDappStatus();
  const { handleConnect, handleCreate } = useCreateVaultActions();

  if (!isWalletConnected)
    return (
      <ConnectWalletButton
        variant="outlined"
        color="secondary"
        size="lg"
        onClick={handleConnect}
        data-testid="myVaults-connectWalletButton"
      >
        Connect wallet to create your vault
      </ConnectWalletButton>
    );

  return (
    <AddVaultButton
      variant="outlined"
      color="secondary"
      size="lg"
      icon={<Plus />}
      onClick={handleCreate}
      data-testid="myVaults-createVaultButton"
    >
      Create new Vault
    </AddVaultButton>
  );
};
