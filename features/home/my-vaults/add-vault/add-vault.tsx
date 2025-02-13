import { useRouter } from 'next/router';

import { ButtonIcon, Plus } from '@lidofinance/lido-ui';

export const AddVault = () => {
  const router = useRouter();

  const handleNavigate = () => {
    void router.push('/settings/create');
  };

  return (
    <ButtonIcon
      variant="outlined"
      color="secondary"
      size="lg"
      icon={<Plus />}
      onClick={handleNavigate}
    >
      Create new Vault
    </ButtonIcon>
  );
};
