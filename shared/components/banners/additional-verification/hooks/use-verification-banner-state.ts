import { isAddressEqual, type Address } from 'viem';

import { useDappStatus } from 'modules/web3';
import { useVaultRiskStatus } from 'modules/vaults';

import type {
  AdditionalVerificationAction,
  CustodyRoleMembers,
  VerificationBannerState,
} from '../types';

import { config } from 'config';

export const useVerificationBannerDefender = (
  action: AdditionalVerificationAction,
): VerificationBannerState => {
  // DEV only feature - will throw if on in production environment
  const SECURITY_OVERRIDE_DEV_ENV = !config.dangerouslyDisableVaultSecurity;

  const { isDappActive, address } = useDappStatus();
  const {
    isVaultOwner,
    isMultipleOwners,
    firstAdmin,
    isSupplier = false,
    isRepayer = false,
    isTierDefault,
    isNodeOperatorVerified,
    defaultAdminList,
    withdrawersList,
    mintersList,
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
      isVaultOwner === true &&
      isTierDefault === false &&
      isNodeOperatorVerified === true,
  );

  const isMultipleOwnersErrorVisible = Boolean(
    SECURITY_OVERRIDE_DEV_ENV &&
      isDappActive &&
      isMultipleOwners === true &&
      hasActionPermissionOrOwnership === true &&
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

  // only the connected address is filtered out: another DEFAULT_ADMIN holding a
  // custody role is exactly the risk this banner is meant to surface
  const excludeSelf = (list?: Address[]) =>
    (list ?? []).filter(
      (account) => !address || !isAddressEqual(account, address),
    );

  const custodyRoleMembers: CustodyRoleMembers[] = [
    { role: 'withdrawer' as const, addresses: excludeSelf(withdrawersList) },
    { role: 'minter' as const, addresses: excludeSelf(mintersList) },
  ].filter(({ addresses }) => addresses.length > 0);

  const isCustodyPermissionWarningVisible = Boolean(
    SECURITY_OVERRIDE_DEV_ENV &&
      isDappActive &&
      hasActionPermissionOrOwnership &&
      custodyRoleMembers.length > 0,
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
    isCustodyPermissionWarningVisible,
    isTierDefault,
    isNodeOperatorVerified,
    confirmationRequired: {
      notOwner: isNotOwnerWarningVisible,
      multipleOwners: isMultipleOwnersWarningVisible,
      unguaranteedDeposits: isUnguaranteedDepositsWarningVisible,
      custodyPermission: isCustodyPermissionWarningVisible,
    },
    isErrorBannerVisible:
      isNotOwnerErrorVisible ||
      isMultipleOwnersErrorVisible ||
      isUnguaranteedDepositsErrorVisible,
    isWarningBannerVisible:
      isNotOwnerWarningVisible ||
      isMultipleOwnersWarningVisible ||
      isUnguaranteedDepositsWarningVisible ||
      isCustodyPermissionWarningVisible,
    defaultAdminList,
    firstAdmin,
    nodeOperator,
    custodyRoleMembers,
  };
};
