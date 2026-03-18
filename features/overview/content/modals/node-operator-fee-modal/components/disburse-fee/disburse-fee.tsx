import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { useVaultOverview } from 'features/overview/vault-overview';

import { ButtonStyled } from './styles';

export const DisburseFee = () => {
  const { vaultAddress } = useVault();
  const { values } = useVaultOverview();
  const router = useRouter();

  const navigate = useCallback(() => {
    if (!vaultAddress) return;

    void router.push(appPaths.vaults.vault(vaultAddress).disburse);
  }, [router, vaultAddress]);

  const { undisbursedNodeOperatorFee } = values ?? {};
  if (!undisbursedNodeOperatorFee) {
    return null;
  }

  return (
    <ButtonStyled
      color="secondary"
      variant="outlined"
      size="xs"
      onClick={navigate}
      data-testid="undisbursedNodeOperatorFee-modal-actionButton"
    >
      Disburse
    </ButtonStyled>
  );
};
