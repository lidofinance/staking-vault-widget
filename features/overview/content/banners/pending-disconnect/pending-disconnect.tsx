import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { useVault, useVaultConfirmingRoles, vaultTexts } from 'modules/vaults';
import { NoticeContainer } from 'shared/components';
import { appPaths } from 'consts/routing';

import { ApplyButton } from './styles';

const texts = vaultTexts.metrics.pendingDisconnect;

export const PendingDisconnect = () => {
  const { activeVault, vaultAddress } = useVault();
  const router = useRouter();
  const { hasAdmin } = useVaultConfirmingRoles();
  const { isReportAvailable, isPendingDisconnect, isVaultDisconnected } =
    activeVault ?? {};
  const description = isReportAvailable
    ? texts.description.reportIsAvailable
    : texts.description.reportIsNotAvailable;

  const handleProceedDisconnect = useCallback(() => {
    if (!vaultAddress) {
      return;
    }

    void router.push(
      appPaths.vaults.vault(vaultAddress).settings('disconnect'),
    );
  }, [router, vaultAddress]);

  if (!isPendingDisconnect || isVaultDisconnected) {
    return null;
  }

  return (
    <NoticeContainer title={texts.title} type="info" description={description}>
      {isReportAvailable && hasAdmin && (
        <ApplyButton
          size="xs"
          variant="outlined"
          color="secondary"
          onClick={handleProceedDisconnect}
        >
          Complete disconnection
        </ApplyButton>
      )}
    </NoticeContainer>
  );
};
