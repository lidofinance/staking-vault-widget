import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import type { Address } from 'viem';

import { appPaths } from 'consts/routing';
import { useVaultInfo } from 'modules/vaults';

import { modals } from 'features/overview/consts';
import type { OverviewModalItem } from 'features/overview/types';

export const useOverviewModal = () => {
  const router = useRouter();
  const { vaultAddress } = useVaultInfo();
  const rawModal = router.query.modal;

  const currentModal = useMemo<OverviewModalItem | null>(() => {
    return typeof rawModal === 'string' &&
      modals.includes(rawModal as OverviewModalItem)
      ? (rawModal as OverviewModalItem)
      : null;
  }, [rawModal]);

  const openModal = useCallback(
    (modal: OverviewModalItem) => {
      const pathname = appPaths.vaults.vault(vaultAddress as Address).overview;
      void router.push({ pathname, query: { modal } }, undefined, {
        shallow: true,
      });
    },
    [router, vaultAddress],
  );

  const closeModal = useCallback(() => {
    const pathname = appPaths.vaults.vault(vaultAddress as Address).overview;
    void router.push({ pathname, query: {} }, undefined, { shallow: true });
  }, [router, vaultAddress]);

  return { currentModal, openModal, closeModal };
};
