import { useDappStatus } from 'modules/web3';
import { useVaultRiskStatus } from 'modules/vaults';

import type {
  AdditionalVerificationAction,
  VerificationBannerState,
} from '../types';

export const useVerificationBannerDefender = (
  action: AdditionalVerificationAction,
): VerificationBannerState => {
  const { isDappActive } = useDappStatus();
  const {
    isVaultOwner,
    isMultipleOwners,
    firstAdmin,
    isSupplier = false,
    isRepayer = false,
    isRebalancer = false,
    isTierDefault,
    isNodeOperatorVerified,
    defaultAdminList,
    nodeOperator,
    isUnguaranteedDepositsAllowed,
    isSuccess,
  } = useVaultRiskStatus();

  const permissionMap: Record<AdditionalVerificationAction, boolean> = {
    repay: isRepayer,
    supply: isSupplier,
    rebalance: isRebalancer,
  };

  const hasActionPermission = permissionMap[action];
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
