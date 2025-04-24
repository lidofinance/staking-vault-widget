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
 * @notice Node operator manager role:
 * - confirms confirm expiry;
 * - confirms ownership transfer;
 * - assigns NODE_OPERATOR_FEE_CONFIRM_ROLE;
 * - assigns NODE_OPERATOR_FEE_CLAIM_ROLE.
 */
export const NODE_OPERATOR_MANAGER_ROLE = keccak256(
  toHex('vaults.NodeOperatorFee.NodeOperatorManagerRole'),
);

/**
 * @notice Claims node operator fee.
 */
export const NODE_OPERATOR_FEE_CLAIM_ROLE = keccak256(
  toHex('vaults.NodeOperatorFee.FeeClaimRole'),
);

export const RECOVER_ASSETS_ROLE = keccak256(
  toHex('vaults.Dashboard.RecoverAssets'),
);

/**
 * @notice Adjusts rewards to allow fee correction during side deposits or consolidations
 */
export const NODE_OPERATOR_REWARDS_ADJUST_ROLE = keccak256(
  toHex('vaults.NodeOperatorFee.RewardsAdjustRole'),
);

/**
 * @notice Permission for getting compensation for disproven validator predeposit from PDG
 */
export const PDG_COMPENSATE_PREDEPOSIT_ROLE = keccak256(
  toHex('vaults.Permissions.PDGCompensatePredeposit'),
);

/**
 * @notice Permission for proving valid vault validators unknown to the PDG
 */
export const PDG_PROVE_VALIDATOR_ROLE = keccak256(
  toHex('vaults.Permissions.PDGProveValidator'),
);

/**
 * @notice Permission for unguarnateed deposit to trusted validators
 */
export const UNGUARANTEED_BEACON_CHAIN_DEPOSIT_ROLE = keccak256(
  toHex('vaults.Permissions.UnguaranteedBeaconChainDeposit'),
);

/**
 * @dev Permission for deauthorizing Lido VaultHub from the StakingVault.
 */
export const LIDO_VAULTHUB_DEAUTHORIZATION_ROLE = keccak256(
  toHex('vaults.Permissions.LidoVaultHubDeauthorization'),
);

/**
 * @dev Permission for granting authorization to Lido VaultHub on the StakingVault.
 */
export const LIDO_VAULTHUB_AUTHORIZATION_ROLE = keccak256(
  toHex('vaults.Permissions.LidoVaultHubAuthorization'),
);

/**
 * @dev Permission for ossifying the StakingVault.
 */
export const OSSIFY_ROLE = keccak256(toHex('vaults.Permissions.Ossify'));

/**
 * @dev Permission for setting depositor on the StakingVault.
 */
export const SET_DEPOSITOR_ROLE = keccak256(
  toHex('vaults.Permissions.SetDepositor'),
);

/**
 * @dev Permission for resetting locked amount on the disconnected StakingVault.
 */
export const RESET_LOCKED_ROLE = keccak256(
  toHex('vaults.Permissions.ResetLocked'),
);

/**
 * @dev Permission for requesting change of tier on the OperatorGrid.
 */
export const REQUEST_TIER_CHANGE_ROLE = keccak256(
  toHex('vaults.Permissions.RequestTierChange'),
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
  RECOVER_ASSETS_ROLE,
  NODE_OPERATOR_FEE_CLAIM_ROLE,
  NODE_OPERATOR_REWARDS_ADJUST_ROLE,
  PDG_COMPENSATE_PREDEPOSIT_ROLE,
  PDG_PROVE_VALIDATOR_ROLE,
  UNGUARANTEED_BEACON_CHAIN_DEPOSIT_ROLE,
  LIDO_VAULTHUB_DEAUTHORIZATION_ROLE,
  LIDO_VAULTHUB_AUTHORIZATION_ROLE,
  OSSIFY_ROLE,
  SET_DEPOSITOR_ROLE,
  RESET_LOCKED_ROLE,
  REQUEST_TIER_CHANGE_ROLE,
};

export const permissionsKeys = Object.keys(permissions) as PERMISSION[];
export type EntirePermissionsType = typeof permissions;
export type PERMISSION = keyof EntirePermissionsType;
