import { keccak256, toHex } from 'viem/utils';
import { Hex } from 'viem';

/**
 * @notice Permission for funding the StakingVault.
 */
export const FUND_ROLE = keccak256(toHex('vaults.Permissions.Fund'));

/**
 * @notice Permission for withdrawing funds from the StakingVault.
 */
export const WITHDRAW_ROLE = keccak256(toHex('vaults.Permissions.Withdraw'));

/**
 * @notice Permission for locking ether on StakingVault.
 */
export const LOCK_ROLE = keccak256(toHex('vaults.Permissions.Lock'));

/**
 * @notice Permission for minting stETH shares backed by the StakingVault.
 */
export const MINT_ROLE = keccak256(toHex('vaults.Permissions.Mint'));

/**
 * @notice Permission for burning stETH shares backed by the StakingVault.
 */
export const BURN_ROLE = keccak256(toHex('vaults.Permissions.Burn'));

/**
 * @notice Permission for rebalancing the StakingVault.
 */
export const REBALANCE_ROLE = keccak256(toHex('vaults.Permissions.Rebalance'));

/**
 * @notice Permission for pausing beacon chain deposits on the StakingVault.
 */
export const PAUSE_BEACON_CHAIN_DEPOSITS_ROLE = keccak256(
  toHex('vaults.Permissions.PauseDeposits'),
);

/**
 * @notice Permission for resuming beacon chain deposits on the StakingVault.
 */
export const RESUME_BEACON_CHAIN_DEPOSITS_ROLE = keccak256(
  toHex('vaults.Permissions.ResumeDeposits'),
);

/**
 * @notice Permission for requesting validator exit from the StakingVault.
 */
export const REQUEST_VALIDATOR_EXIT_ROLE = keccak256(
  toHex('vaults.Permissions.RequestValidatorExit'),
);

/**
 * @notice Permission for triggering validator withdrawal from the StakingVault using EIP-7002 triggerable exit.
 */
export const TRIGGER_VALIDATOR_WITHDRAWAL_ROLE = keccak256(
  toHex('vaults.Permissions.TriggerValidatorWithdrawal'),
);

/**
 * @notice Permission for voluntary disconnecting the StakingVault.
 */
export const VOLUNTARY_DISCONNECT_ROLE = keccak256(
  toHex('vaults.Permissions.VoluntaryDisconnect'),
);

/**
 * @notice Permission for withdrawing disproven validator predeposit from PDG
 */
export const PDG_WITHDRAWAL_ROLE = keccak256(
  toHex('vaults.Permissions.PDGWithdrawal'),
);

/**
 * @notice Permission for assets recovery
 */
export const ASSET_RECOVERY_ROLE = keccak256(
  toHex('vaults.Permissions.AssetRecovery'),
);

/**
 * @notice Node operator manager role:
 * - confirms confirm expiry;
 * - confirms ownership transfer;
 * - assigns NODE_OPERATOR_FEE_CONFIRM_ROLE;
 * - assigns NODE_OPERATOR_FEE_CLAIM_ROLE.
 */
export const NODE_OPERATOR_MANAGER_ROLE = keccak256(
  toHex('vaults.Delegation.NodeOperatorManagerRole'),
);

/**
 * @notice Claims node operator fee.
 */
export const NODE_OPERATOR_FEE_CLAIM_ROLE = keccak256(
  toHex('vaults.Delegation.NodeOperatorFeeClaimRole'),
);

/**
 * @notice default vault admin role.
 */
export const DEFAULT_ADMIN_ROLE =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex;

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
