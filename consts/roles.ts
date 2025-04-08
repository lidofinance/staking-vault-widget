import { keccak256 } from 'viem/utils';

/**
 * @notice Permission for funding the StakingVault.
 */
// @ts-expect-error keccak256 types
export const FUND_ROLE = keccak256('vaults.Permissions.Fund');

/**
 * @notice Permission for withdrawing funds from the StakingVault.
 */
// @ts-expect-error keccak256 types
export const WITHDRAW_ROLE = keccak256('vaults.Permissions.Withdraw');

/**
 * @notice Permission for locking ether on StakingVault.
 */
// @ts-expect-error keccak256 types
export const LOCK_ROLE = keccak256('vaults.Permissions.Lock');

/**
 * @notice Permission for minting stETH shares backed by the StakingVault.
 */
// @ts-expect-error keccak256 types
export const MINT_ROLE = keccak256('vaults.Permissions.Mint');

/**
 * @notice Permission for burning stETH shares backed by the StakingVault.
 */
// @ts-expect-error keccak256 types
export const BURN_ROLE = keccak256('vaults.Permissions.Burn');

/**
 * @notice Permission for rebalancing the StakingVault.
 */
// @ts-expect-error keccak256 types
export const REBALANCE_ROLE = keccak256('vaults.Permissions.Rebalance');

/**
 * @notice Permission for pausing beacon chain deposits on the StakingVault.
 */
// @ts-expect-error keccak256 types
export const PAUSE_BEACON_CHAIN_DEPOSITS_ROLE = keccak256(
  'vaults.Permissions.PauseDeposits',
);

/**
 * @notice Permission for resuming beacon chain deposits on the StakingVault.
 */
// @ts-expect-error keccak256 types
export const RESUME_BEACON_CHAIN_DEPOSITS_ROLE = keccak256(
  'vaults.Permissions.ResumeDeposits',
);

/**
 * @notice Permission for requesting validator exit from the StakingVault.
 */
// @ts-expect-error keccak256 types
export const REQUEST_VALIDATOR_EXIT_ROLE = keccak256(
  'vaults.Permissions.RequestValidatorExit',
);

/**
 * @notice Permission for triggering validator withdrawal from the StakingVault using EIP-7002 triggerable exit.
 */
// @ts-expect-error keccak256 types
export const TRIGGER_VALIDATOR_WITHDRAWAL_ROLE = keccak256(
  'vaults.Permissions.TriggerValidatorWithdrawal',
);

/**
 * @notice Permission for voluntary disconnecting the StakingVault.
 */
// @ts-expect-error keccak256 types
export const VOLUNTARY_DISCONNECT_ROLE = keccak256(
  'vaults.Permissions.VoluntaryDisconnect',
);

/**
 * @notice Permission for withdrawing disproven validator predeposit from PDG
 */
// @ts-expect-error keccak256 types
export const PDG_WITHDRAWAL_ROLE = keccak256(
  'vaults.Permissions.PDGWithdrawal',
);

/**
 * @notice Permission for assets recovery
 */
// @ts-expect-error keccak256 types
export const ASSET_RECOVERY_ROLE = keccak256(
  'vaults.Permissions.AssetRecovery',
);

/**
 * @notice Node operator manager role:
 * - confirms confirm expiry;
 * - confirms ownership transfer;
 * - assigns NODE_OPERATOR_FEE_CONFIRM_ROLE;
 * - assigns NODE_OPERATOR_FEE_CLAIM_ROLE.
 */
// @ts-expect-error keccak256 types
export const NODE_OPERATOR_MANAGER_ROLE = keccak256(
  'vaults.Delegation.NodeOperatorManagerRole',
);

/**
 * @notice Claims node operator fee.
 */
// @ts-expect-error keccak256 types
export const NODE_OPERATOR_FEE_CLAIM_ROLE = keccak256(
  'vaults.Delegation.NodeOperatorFeeClaimRole',
);

export const permissions = {
  FUND_ROLE,
  WITHDRAW_ROLE,
  LOCK_ROLE,
  MINT_ROLE,
  BURN_ROLE,
  REBALANCE_ROLE,
  PAUSE_BEACON_CHAIN_DEPOSITS_ROLE,
  RESUME_BEACON_CHAIN_DEPOSITS_ROLE,
  REQUEST_VALIDATOR_EXIT_ROLE,
  TRIGGER_VALIDATOR_WITHDRAWAL_ROLE,
  VOLUNTARY_DISCONNECT_ROLE,
  PDG_WITHDRAWAL_ROLE,
  ASSET_RECOVERY_ROLE,
  NODE_OPERATOR_MANAGER_ROLE,
  NODE_OPERATOR_FEE_CLAIM_ROLE,
};

export type PERMISSION = keyof typeof permissions;
export type EDITABLE_PERMISSIONS = keyof Omit<
  typeof permissions,
  'NODE_OPERATOR_MANAGER_ROLE' | 'ASSET_RECOVERY_ROLE' | 'PDG_WITHDRAWAL_ROLE'
>;
