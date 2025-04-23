import { keccak256, parseEther, toHex } from 'viem';

export const VAULTS_PER_PAGE = 4;

export const VAULTS_CONNECT_DEPOSIT = parseEther('1');

const toRoleHash = (role: string) => keccak256(toHex(role));

export const VAULTS_ROOT_ROLES_MAP = {
  defaultAdmin: '0x00',
  nodeOperatorManager: toRoleHash(
    'vaults.NodeOperatorFee.NodeOperatorManagerRole',
  ),
};

export const VAULTS_OWNER_ROLES_MAP = {
  funder: toRoleHash('vaults.Permissions.Fund'),
  withdrawer: toRoleHash('vaults.Permissions.Withdraw'),
  locker: toRoleHash('vaults.Permissions.Lock'),
  minter: toRoleHash('vaults.Permissions.Mint'),
  burner: toRoleHash('vaults.Permissions.Burn'),
  rebalancer: toRoleHash('vaults.Permissions.Rebalance'),
  depositsPauser: toRoleHash('vaults.Permissions.PauseDeposits'),
  depositsResumer: toRoleHash('vaults.Permissions.ResumeDeposits'),
  validatorExitRequester: toRoleHash('vaults.Permissions.RequestValidatorExit'),
  validatorWithdrawalTrigger: toRoleHash(
    'vaults.Permissions.TriggerValidatorWithdrawal',
  ),
  volunataryDisconnecter: toRoleHash('vaults.Permissions.VoluntaryDisconnect'),
  pdgCompensater: toRoleHash('vaults.Permissions.PDGCompensatePredeposit'),
  pdgProver: toRoleHash('vaults.Permissions.PDGProveValidator'),
  unguaranteedDepositor: toRoleHash(
    'vaults.Permissions.UnguaranteedBeaconChainDeposit',
  ),
  vaultHubDeathorizer: toRoleHash(
    'vaults.Permissions.LidoVaultHubDeauthorization',
  ),
  vaultHubAuthorizer: toRoleHash(
    'vaults.Permissions.LidoVaultHubAuthorization',
  ),
  ossifyer: toRoleHash('vaults.Permissions.Ossify'),
  depositorSetter: toRoleHash('vaults.Permissions.SetDepositor'),
  lockResetter: toRoleHash('vaults.Permissions.ResetLocked'),
  tierChangeRequester: toRoleHash('vaults.Permissions.RequestTierChange'),
  assetRecoverer: toRoleHash('vaults.Dashboard.RecoverAssets'),
} as const;

export const VAULTS_NO_ROLES_MAP = {
  nodeOperatorFeeClaimer: toRoleHash('vaults.NodeOperatorFee.FeeClaimRole'),
  nodeOperatorRewardsAdjuster: toRoleHash(
    'vaults.NodeOperatorFee.RewardsAdjustRole',
  ),
} as const;

// TOOD: remove in favor on bigint only calc
export const VAULT_TOTAL_BASIS_POINTS = 10_000;
export const VAULT_TOTAL_BASIS_POINTS_BN = 10_000n;

// forms validation values
export const MIN_FEE_VALUE = 0.01;
export const MAX_FEE_VALUE = 99;
export const MIN_CONFIRM_EXPIRY = 24;
export const MAX_CONFIRM_EXPIRY = 24 * 30;
