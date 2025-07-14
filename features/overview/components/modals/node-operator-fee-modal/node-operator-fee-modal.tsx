import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { useVaultOverviewData } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { OverviewModal } from 'features/overview/shared';

import { ButtonStyled } from './styles';

export const NodeOperatorFeeModal = () => {
  const { data: vault } = useVaultOverviewData();
  const router = useRouter();

  const navigate = useCallback(() => {
    if (!vault) return;

    void router.push(appPaths.vaults.vault(vault.address).eth('withdraw'));
  }, [router, vault]);

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
