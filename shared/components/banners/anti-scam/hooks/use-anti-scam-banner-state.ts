import { useDappStatus } from 'modules/web3';
import { useVaultRiskStatus } from 'modules/vaults';

import type { AntiScamAction, AntiScamBannerState } from '../types';

export const useAntiScamBannerDefender = (
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
  } = useVaultRiskStatus();

  const hasActionPermission = action === 'supply' ? isSupplier : isRepayer;
  const hasActionPermissionOrOwnership =
    hasActionPermission || isVaultOwner === true;

  const isNotOwnerWarningVisible = Boolean(
    isDappActive &&
      isVaultOwner === false &&
      hasActionPermission &&
      isTierDefault === false &&
      isNodeOperatorVerified === true,
  );

  const isNotOwnerErrorVisible = Boolean(
    isDappActive &&
      isVaultOwner === false &&
      hasActionPermission &&
      (isTierDefault === true || isNodeOperatorVerified === false),
  );

  const isMultipleOwnersWarningVisible = Boolean(
    isDappActive &&
      isMultipleOwners === true &&
      isTierDefault === false &&
      isVaultOwner === true &&
      isNodeOperatorVerified === true,
  );

  const isMultipleOwnersErrorVisible = Boolean(
    isDappActive &&
      isMultipleOwners === true &&
      isVaultOwner === true &&
      (isTierDefault === true || isNodeOperatorVerified === false),
  );

  const isUnguaranteedDepositsWarningVisible = Boolean(
    isDappActive &&
      hasActionPermissionOrOwnership &&
      isUnguaranteedDepositsAllowed === true &&
      isNodeOperatorVerified === true,
  );

  const isUnguaranteedDepositsErrorVisible = Boolean(
    isDappActive &&
      hasActionPermissionOrOwnership &&
      nodeOperator &&
      isUnguaranteedDepositsAllowed === true &&
      isNodeOperatorVerified === false,
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
