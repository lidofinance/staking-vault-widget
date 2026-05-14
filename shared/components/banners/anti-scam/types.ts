import type { Address } from 'viem';

export const ANTI_SCAM_CONFIRM_FIELD_NAMES = {
  notOwner: 'notOwner',
  multipleOwners: 'multipleOwners',
  unguaranteedDeposits: 'unguaranteedDeposits',
} as const;

export type AntiScamConfirmFieldName =
  (typeof ANTI_SCAM_CONFIRM_FIELD_NAMES)[keyof typeof ANTI_SCAM_CONFIRM_FIELD_NAMES];

export type AntiScamAction = 'supply' | 'repay';
export type RiskVariant = 'notOwner' | 'multipleOwners';

export type AntiScamConfirmationFlags = Record<
  AntiScamConfirmFieldName,
  boolean
>;

export type AntiScamConfirmFieldValues = AntiScamConfirmationFlags;

export type AntiScamBannerState = {
  action: AntiScamAction;
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
  confirmationRequired: AntiScamConfirmationFlags;
  defaultAdminList?: Address[];
  firstAdmin?: Address;
  nodeOperator?: Address;
};
