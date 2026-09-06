import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { useVault, useVaultConfirmingRoles } from 'modules/vaults';
import { vaultTexts } from 'modules/vaults/consts/texts';
import { appPaths } from 'consts/routing';

import { NoticeContainer } from '../../notice-container';

import { ActionButton } from './styles';

const texts = vaultTexts.metrics.banners.vaultConnection.pendingConnect;

export const PendingConnect = () => {
  const { vaultAddress } = useVault();
  const router = useRouter();
  const { hasAdmin } = useVaultConfirmingRoles();

  const handleNavigate = useCallback(() => {
    if (!vaultAddress) {
      return;
    }

    void router.push(appPaths.vaults.vault(vaultAddress).overview);
  }, [vaultAddress, router]);

  return (
    <NoticeContainer
      type="info"
      title={texts.title}
      description={texts.description}
    >
      {hasAdmin && (
        <ActionButton
          size="xs"
          variant="outlined"
          color="secondary"
          onClick={handleNavigate}
        >
          {texts.actionText}
        </ActionButton>
      )}
    </NoticeContainer>
  );
};
