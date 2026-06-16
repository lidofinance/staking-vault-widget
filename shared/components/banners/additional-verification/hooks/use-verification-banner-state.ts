import { useDappStatus } from 'modules/web3';
import { useVaultRiskStatus } from 'modules/vaults';

import type {
  AdditionalVerificationAction,
  VerificationBannerState,
} from '../types';

import { config } from 'config';

export const useVerificationBannerDefender = (
  action: AdditionalVerificationAction,
): VerificationBannerState => {
  // DEV only feature - will throw if on in production environment
  const SECURITY_OVERRIDE_DEV_ENV = !config.dangerouslyDisableVaultSecurity;

  const { isDappActive } = useDappStatus();
  const {
    isVaultOwner,
    isMultipleOwners,
    firstAdmin,
    isSupplier = false,
    isRepayer = false,
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
  };

  const hasActionPermission = permissionMap[action];
  const hasActionPermissionOrOwnership =
    hasActionPermission || isVaultOwner === true;

  const isNotOwnerWarningVisible = Boolean(
    SECURITY_OVERRIDE_DEV_ENV &&
      isDappActive &&
      isVaultOwner === false &&
      hasActionPermission &&
      isTierDefault === false &&
      isNodeOperatorVerified === true,
  );

  const isNotOwnerErrorVisible = Boolean(
    SECURITY_OVERRIDE_DEV_ENV &&
      isDappActive &&
      isVaultOwner === false &&
      hasActionPermission &&
      (isTierDefault === true || isNodeOperatorVerified === false),
  );

  const isMultipleOwnersWarningVisible = Boolean(
    SECURITY_OVERRIDE_DEV_ENV &&
      isDappActive &&
      isMultipleOwners === true &&
      isTierDefault === false &&
      isVaultOwner === true &&
      isNodeOperatorVerified === true,
  );

  const isMultipleOwnersErrorVisible = Boolean(
    SECURITY_OVERRIDE_DEV_ENV &&
      isDappActive &&
      isMultipleOwners === true &&
      hasActionPermission &&
      isVaultOwner === true &&
      (isTierDefault === true || isNodeOperatorVerified === false),
  );

  const isUnguaranteedDepositsWarningVisible = Boolean(
    SECURITY_OVERRIDE_DEV_ENV &&
      isDappActive &&
      hasActionPermissionOrOwnership &&
      isUnguaranteedDepositsAllowed === true &&
      isNodeOperatorVerified === true,
  );

  const isUnguaranteedDepositsErrorVisible = Boolean(
    SECURITY_OVERRIDE_DEV_ENV &&
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
