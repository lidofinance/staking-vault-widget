import { useVault } from 'modules/vaults';

export const useDisableForm = () => {
  const { activeVault } = useVault();
  const { isPendingDisconnect, isPendingConnect, isVaultDisconnected } =
    activeVault ?? {};

  return (
    !activeVault ||
    isPendingDisconnect ||
    isPendingConnect ||
    isVaultDisconnected
  );
};
