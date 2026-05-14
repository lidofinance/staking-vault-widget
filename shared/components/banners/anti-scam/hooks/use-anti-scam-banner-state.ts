import { useMemo } from 'react';

import { useDappStatus } from 'modules/web3';
import { useMitigateRisks } from 'modules/vaults';

import type { AntiScamAction, AntiScamBannerState } from '../types';

export const useAntiScamBannerState = (
  action: AntiScamAction,
): AntiScamBannerState => {
  const { isDappActive } = useDappStatus();
  const {
    isVaultOwner,
    isMultipleOwners,
    firstAdmin,
    isSupplier,
    isRepayer,
    isTierDefault,
    isNodeOperatorVerified,
    defaultAdminList,
    nodeOperator,
    isUnguaranteedDepositsAllowed,
    isSuccess,
  } = useMitigateRisks();

  const hasActionPermission = useMemo(
    () => (action === 'supply' ? isSupplier : isRepayer),
    [action, isSupplier, isRepayer],
  );

  const hasActionPermissionOrOwnership =
    hasActionPermission || isVaultOwner === true;

  const isNotOwnerWarningVisible = useMemo(
    () =>
      Boolean(
        isDappActive &&
          isVaultOwner === false &&
          hasActionPermission &&
          isTierDefault === false &&
          isNodeOperatorVerified === true,
      ),
    [
      isDappActive,
      isVaultOwner,
      hasActionPermission,
      isTierDefault,
      isNodeOperatorVerified,
    ],
  );

  const isNotOwnerErrorVisible = useMemo(
    () =>
      Boolean(
        isDappActive &&
          isVaultOwner === false &&
          hasActionPermission &&
          (isTierDefault === true || isNodeOperatorVerified === false),
      ),
    [
      isDappActive,
      isVaultOwner,
      hasActionPermission,
      isTierDefault,
      isNodeOperatorVerified,
    ],
  );

  const isMultipleOwnersWarningVisible = useMemo(
    () =>
      Boolean(
        isDappActive &&
          isMultipleOwners === true &&
          isTierDefault === false &&
          isVaultOwner === true &&
          isNodeOperatorVerified === true,
      ),
    [
      isDappActive,
      isMultipleOwners,
      isTierDefault,
      isVaultOwner,
      isNodeOperatorVerified,
    ],
  );

  const isMultipleOwnersErrorVisible = useMemo(
    () =>
      Boolean(
        isDappActive &&
          isMultipleOwners === true &&
          isVaultOwner === true &&
          (isTierDefault === true || isNodeOperatorVerified === false),
      ),
    [
      isDappActive,
      isMultipleOwners,
      isVaultOwner,
      isTierDefault,
      isNodeOperatorVerified,
    ],
  );

  const isUnguaranteedDepositsWarningVisible = useMemo(
    () =>
      Boolean(
        isDappActive &&
          hasActionPermissionOrOwnership &&
          isUnguaranteedDepositsAllowed === true &&
          isNodeOperatorVerified === true,
      ),
    [
      isDappActive,
      hasActionPermissionOrOwnership,
      isUnguaranteedDepositsAllowed,
      isNodeOperatorVerified,
    ],
  );

  const isUnguaranteedDepositsErrorVisible = useMemo(
    () =>
      Boolean(
        isDappActive &&
          hasActionPermissionOrOwnership &&
          nodeOperator &&
          isUnguaranteedDepositsAllowed === true &&
          isNodeOperatorVerified === false,
      ),
    [
      isDappActive,
      hasActionPermissionOrOwnership,
      nodeOperator,
      isUnguaranteedDepositsAllowed,
      isNodeOperatorVerified,
    ],
  );

  return {
    action,
    isReady: isSuccess,
    isNotOwnerWarningVisible,
    isNotOwnerErrorVisible,
    isMultipleOwnersWarningVisible,
    isMultipleOwnersErrorVisible,
    isUnguaranteedDepositsWarningVisible,
    isUnguaranteedDepositsErrorVisible,
    isTierDefault,
    isNodeOperatorVerified,
    confirmationRequired: {
      notOwner: isNotOwnerWarningVisible,
      multipleOwners: isMultipleOwnersWarningVisible,
      unguaranteedDeposits: isUnguaranteedDepositsWarningVisible,
    },
    isErrorBannerVisible:
      isNotOwnerErrorVisible ||
      isMultipleOwnersErrorVisible ||
      isUnguaranteedDepositsErrorVisible,
    isWarningBannerVisible:
      isNotOwnerWarningVisible ||
      isMultipleOwnersWarningVisible ||
      isUnguaranteedDepositsWarningVisible,
    defaultAdminList,
    firstAdmin,
    nodeOperator,
  };
};
