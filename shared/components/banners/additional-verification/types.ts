import type { Address } from 'viem';

export const VERIFICATION_CONFIRM_FIELD_NAMES = {
  notOwner: 'notOwner',
  multipleOwners: 'multipleOwners',
  unguaranteedDeposits: 'unguaranteedDeposits',
} as const;

export type VerificationConfirmFieldName =
  (typeof VERIFICATION_CONFIRM_FIELD_NAMES)[keyof typeof VERIFICATION_CONFIRM_FIELD_NAMES];

export type AdditionalVerificationAction = 'supply' | 'repay';
export type RiskVariant = 'notOwner' | 'multipleOwners';

export type VerificationConfirmationFlags = Record<
  VerificationConfirmFieldName,
  boolean
>;

export type VerificationConfirmFieldValues = VerificationConfirmationFlags;

export type VerificationBannerState = {
  action: AdditionalVerificationAction;
  isReady: boolean;
  isNotOwnerWarningVisible: boolean;
  isNotOwnerErrorVisible: boolean;
  isMultipleOwnersWarningVisible: boolean;
  isMultipleOwnersErrorVisible: boolean;
  isUnguaranteedDepositsWarningVisible: boolean;
  isUnguaranteedDepositsErrorVisible: boolean;
  isTierDefault?: boolean;
  isNodeOperatorVerified?: boolean;
  isErrorBannerVisible: boolean;
  isWarningBannerVisible: boolean;
  confirmationRequired: VerificationConfirmationFlags;
  defaultAdminList?: Address[];
  firstAdmin?: Address;
  nodeOperator?: Address;
};
