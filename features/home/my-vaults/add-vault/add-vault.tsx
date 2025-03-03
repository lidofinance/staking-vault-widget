import { useRouter } from 'next/router';

import { Plus } from '@lidofinance/lido-ui';
import { AddVaultButton } from 'features/home/styles';

import { AppPaths } from 'consts/urls';

export const AddVault = () => {
  const router = useRouter();

  const handleNavigate = () => {
    void router.push(AppPaths.createVault);
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
