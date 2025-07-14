import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { appPaths } from 'consts/routing';
import { useVaultOverviewData } from 'modules/vaults';

import { modals } from 'features/overview/consts';
import type { OverviewModalItem } from 'features/overview/types';

export const useOverviewModal = () => {
  const router = useRouter();
  const { data: vault } = useVaultOverviewData();
  const rawModal = router.query.modal;

  const currentModal = useMemo<OverviewModalItem | null>(() => {
    return typeof rawModal === 'string' &&
      modals.includes(rawModal as OverviewModalItem)
      ? (rawModal as OverviewModalItem)
      : null;
  }, [rawModal]);

  const openModal = useCallback(
    (modal: OverviewModalItem) => {
      if (!vault) return;

      const pathname = appPaths.vaults.vault(vault.address).overview;
      void router.push({ pathname, query: { modal } }, undefined, {
        shallow: true,
      });
    },
    [router, vault],
  );

  const closeModal = useCallback(() => {
    if (!vault) return;

    const pathname = appPaths.vaults.vault(vault.address).overview;
    void router.push({ pathname, query: {} }, undefined, { shallow: true });
  }, [router, vault]);

  return { currentModal, openModal, closeModal };
};
