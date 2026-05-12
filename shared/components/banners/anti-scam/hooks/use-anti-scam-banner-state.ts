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

  const hasActionPermission = action === 'supply' ? isSupplier : isRepayer;
  const hasActionPermissionOrOwnership =
    hasActionPermission || isVaultOwner === true;

  const isNotOwnerWarningVisible = Boolean(
    isDappActive &&
      isVaultOwner === false &&
      isMultipleOwners === false &&
      firstAdmin &&
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
      isNodeOperatorVerified === true &&
      defaultAdminList,
  );

  const isMultipleOwnersErrorVisible = Boolean(
    isDappActive &&
      isMultipleOwners === true &&
      isVaultOwner === true &&
      (isTierDefault === true || isNodeOperatorVerified === false),
  );

  const isUnguaranteedDepositsWarningVisible = Boolean(
    isDappActive &&
      isTierDefault === false &&
      hasActionPermissionOrOwnership &&
      isUnguaranteedDepositsAllowed === true &&
      isNodeOperatorVerified === true,
  );

  const isUnguaranteedDepositsErrorVisible = Boolean(
    isDappActive &&
      hasActionPermissionOrOwnership &&
      isTierDefault === false &&
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
    defaultAdminList,
    firstAdmin,
    nodeOperator,
  };
};
