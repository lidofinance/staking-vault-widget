import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

import { modals } from 'features/overview/consts';
import type { OverviewModalItem } from 'features/overview/types';

const modalEventMap = {
  totalValue: MATOMO_CLICK_EVENTS_TYPES.clickOverviewTotalValuePopup,
  healthFactorNumber: MATOMO_CLICK_EVENTS_TYPES.clickOverviewHealthFactorPopup,
  netApr: MATOMO_CLICK_EVENTS_TYPES.clickOverviewNetStakingAPRPopup,
  balance: MATOMO_CLICK_EVENTS_TYPES.clickOverviewUnstakedBalancePopup,
  withdrawableEther:
    MATOMO_CLICK_EVENTS_TYPES.clickOverviewWithdrawableETHPopup,
  undisbursedNodeOperatorFee: MATOMO_CLICK_EVENTS_TYPES.clickOverviewNOFeePopup,
  unsettledLidoFees: MATOMO_CLICK_EVENTS_TYPES.clickOverviewLidoFeesPopup,
  vaultLiability: MATOMO_CLICK_EVENTS_TYPES.clickOverviewStETHLiabilityPopup,
} as const;

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

      trackMatomoEvent(modalEventMap[modal]);
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
