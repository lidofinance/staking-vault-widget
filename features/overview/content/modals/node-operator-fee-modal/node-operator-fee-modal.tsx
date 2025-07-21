import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { OverviewModal } from 'features/overview/shared';

import { ButtonStyled } from './styles';

export const NodeOperatorFeeModal = () => {
  const { vaultAddress } = useVault();
  const router = useRouter();

  const navigate = useCallback(() => {
    if (!vaultAddress) return;

    void router.push(appPaths.vaults.vault(vaultAddress).claim);
  }, [router, vaultAddress]);

  return (
    <OverviewModal
      name="undisbursedNodeOperatorFee"
      amountRightDecorator={
        <ButtonStyled
          color="secondary"
          variant="outlined"
          size="xs"
          onClick={navigate}
        >
          Disburse
        </ButtonStyled>
      }
    />
  );
};
