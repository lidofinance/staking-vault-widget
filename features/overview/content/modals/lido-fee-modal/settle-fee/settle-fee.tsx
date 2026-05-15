import { useCallback } from 'react';

import { isBigint } from 'utils';
import { useSettleLidoFees } from 'modules/vaults';

import { useVaultOverview } from 'features/overview/vault-overview';
import { useOverviewModal } from 'features/overview/hooks';

import { ButtonStyled } from './styles';

export const SettleFee = () => {
  const { values } = useVaultOverview();
  const { closeModal } = useOverviewModal();
  const { settleLidoFees } = useSettleLidoFees();

  const { unsettledLidoFees } = values ?? {};
  const onSettleFee = useCallback(async () => {
    await closeModal();
    await settleLidoFees();
  }, [closeModal, settleLidoFees]);

  if (!isBigint(unsettledLidoFees) || unsettledLidoFees === 0n) {
    return null;
  }

  return (
    <ButtonStyled
      color="secondary"
      variant="outlined"
      size="xs"
      onClick={onSettleFee}
      data-testid="unsettledLidoFees-modal-actionButton"
    >
      Settle
    </ButtonStyled>
  );
};
