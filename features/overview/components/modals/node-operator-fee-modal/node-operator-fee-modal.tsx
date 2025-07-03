import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Address } from 'viem';

import { useVaultInfo } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { OverviewModal } from 'features/overview/shared';

import { ButtonStyled } from './styles';

export const NodeOperatorFeeModal = () => {
  const { vaultAddress } = useVaultInfo();
  const router = useRouter();

  const navigate = useCallback(() => {
    void router.push(
      appPaths.vaults.vault(vaultAddress as Address).eth('withdraw'),
    );
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
