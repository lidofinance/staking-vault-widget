import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { appPaths } from 'consts/routing';

import { modals } from 'features/overview/consts';
import type { OverviewModalItem } from 'features/overview/types';
import { useVault } from 'modules/vaults';

export const useOverviewModal = () => {
  const router = useRouter();
  const { vaultAddress } = useVault();
  const rawModal = router.query.modal;

  const currentModal = useMemo<OverviewModalItem | null>(() => {
    return typeof rawModal === 'string' &&
      modals.includes(rawModal as OverviewModalItem)
      ? (rawModal as OverviewModalItem)
      : null;
  }, [rawModal]);

  const openModal = useCallback(
    (modal: OverviewModalItem) => {
      if (!vaultAddress) return;

      const pathname = appPaths.vaults.vault(vaultAddress).overview;
      void router.push({ pathname, query: { modal } }, undefined, {
        shallow: true,
      });
    },
    [router, vaultAddress],
  );

  const closeModal = useCallback(() => {
    if (!vaultAddress) return;

    const pathname = appPaths.vaults.vault(vaultAddress).overview;
    void router.push({ pathname, query: {} }, undefined, { shallow: true });
  }, [router, vaultAddress]);

  return { currentModal, openModal, closeModal };
};
