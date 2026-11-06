import {
  useSendReport,
  useVault,
  useVaultConfirmingRoles,
  vaultTexts,
} from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { ButtonStyled } from './styles';

const { loading, completed } = vaultTexts.actions.disconnectVault.applyReport;

export const ApplyReportAction = () => {
  const { isLoading, activeVault } = useVault();
  const { hasAdmin } = useVaultConfirmingRoles();
  const {
    applyReport,
    mutation: { isPending },
  } = useSendReport({ loadingText: loading, completedText: completed });
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
        loading={isPending}
        data-testid="action-btn"
      >
        {text}
      </ButtonStyled>
    </InlineLoader>
  );
};
