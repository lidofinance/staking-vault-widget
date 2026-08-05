import { useVault, useVaultConfirmingRoles } from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { useApplyReport } from '../../hooks';

import { ButtonStyled } from './styles';

export const ApplyReportAction = () => {
  const { isLoading, activeVault } = useVault();
  const { hasAdmin } = useVaultConfirmingRoles();
  const { applyReport } = useApplyReport();
  const {
    isReportFresh = false,
    isVaultDisconnected = false,
    isPendingDisconnect = false,
  } = activeVault ?? {};

  const isDisabled =
    isLoading ||
    isReportFresh ||
    isVaultDisconnected ||
    !isPendingDisconnect ||
    !hasAdmin;

  const text = isReportFresh
    ? 'Wait for next Oracle report'
    : 'Apply fresh report';

  return (
    <InlineLoader isLoading={isLoading} height={32} width={200}>
      <ButtonStyled
        dashboardRole="defaultAdmin"
        size="xs"
        onClick={applyReport}
        disabled={isDisabled}
        data-testid="action-btn"
      >
        {text}
      </ButtonStyled>
    </InlineLoader>
  );
};
