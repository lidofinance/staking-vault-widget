import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { validatorsModals } from 'features/validators/const';
import type { ValidatorsModalItem } from 'features/validators/types';

export const useValidatorModal = () => {
  const router = useRouter();
  const { vaultAddress } = useVault();
  const rawModal = router.query.modal;

  const currentModal = useMemo<ValidatorsModalItem | null>(() => {
    return typeof rawModal === 'string' &&
      validatorsModals.includes(rawModal as ValidatorsModalItem)
      ? (rawModal as ValidatorsModalItem)
      : null;
  }, [rawModal]);

  const openModal = useCallback(
    (modal: ValidatorsModalItem) => {
      if (!vaultAddress) return;

      const pathname = appPaths.vaults.vault(vaultAddress).validators;
      void router.push({ pathname, query: { modal } }, undefined, {
        shallow: true,
      });
    },
    [router, vaultAddress],
  );

  const closeModal = useCallback(() => {
    if (!vaultAddress) return;

    const pathname = appPaths.vaults.vault(vaultAddress).validators;
    void router.push({ pathname, query: {} }, undefined, { shallow: true });
  }, [router, vaultAddress]);

  return { currentModal, openModal, closeModal };
};
