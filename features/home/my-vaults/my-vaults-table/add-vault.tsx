import { useRouter } from 'next/router';

import { Plus } from '@lidofinance/lido-ui';
import { AddVaultButton } from './styles';

import { appPaths } from 'consts/routing';

export const AddVault = () => {
  const router = useRouter();

  const handleNavigate = () => {
    void router.push(appPaths.vaults.create);
  };

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
