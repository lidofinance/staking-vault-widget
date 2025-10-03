import { keccak256, toHex, zeroHash } from 'viem';

const toRoleHash = (role: string) => keccak256(toHex(role));

// Mapping of role names to their contract hashes

export const VAULTS_ROOT_ROLES_MAP = {
  defaultAdmin: zeroHash,
  nodeOperatorManager: toRoleHash(
    'vaults.NodeOperatorFee.NodeOperatorManagerRole',
  ),
} as const;

export const VAULTS_OWNER_ROLES_MAP = {
  supplier: toRoleHash('vaults.Permissions.Fund'),
  withdrawer: toRoleHash('vaults.Permissions.Withdraw'),
  minter: toRoleHash('vaults.Permissions.Mint'),
  repayer: toRoleHash('vaults.Permissions.Burn'),
  rebalancer: toRoleHash('vaults.Permissions.Rebalance'),
  depositsPauser: toRoleHash('vaults.Permissions.PauseDeposits'),
  depositsResumer: toRoleHash('vaults.Permissions.ResumeDeposits'),
  validatorExitRequester: toRoleHash('vaults.Permissions.RequestValidatorExit'),
  validatorWithdrawalTrigger: toRoleHash(
    'vaults.Permissions.TriggerValidatorWithdrawal',
  ),
  volunataryDisconnecter: toRoleHash('vaults.Permissions.VoluntaryDisconnect'),
  vaultConfiguration: toRoleHash('vaults.Permissions.VaultConfiguration'),
  assetCollector: toRoleHash('vaults.Dashboard.CollectVaultERC20'),
} as const;

export const VAULTS_NO_ROLES_MAP = {
  feeExemptRole: toRoleHash('vaults.NodeOperatorFee.FeeExemptRole'),
  unguaranteedDepositRole: toRoleHash(
    'vaults.NodeOperatorFee.UnguaranteedDepositRole',
  ),
  proveUnknownValidatorsRole: toRoleHash(
    'vaults.NodeOperatorFee.proveUnknownValidatorsRole',
  ),
} as const;

export const VAULTS_ALL_ROLES_MAP = {
  ...VAULTS_ROOT_ROLES_MAP,
  ...VAULTS_OWNER_ROLES_MAP,
  ...VAULTS_NO_ROLES_MAP,
} as const;

// Typings

export type VAULT_OWNER_ROLES = keyof typeof VAULTS_OWNER_ROLES_MAP;

export type VAULTS_NO_ROLES = keyof typeof VAULTS_NO_ROLES_MAP;

export type VAULT_ROOT_ROLES = keyof typeof VAULTS_ROOT_ROLES_MAP;

export type VAULTS_ALL_ROLES = keyof typeof VAULTS_ALL_ROLES_MAP;

// Ordered lists for display in UI

export const VAULT_MANAGER_PERMISSIONS_LIST: VAULT_OWNER_ROLES[] = [
  'supplier',
  'withdrawer',
  'minter',
  'repayer',
  'rebalancer',
  'depositsPauser',
  'depositsResumer',
  'validatorExitRequester',
  'validatorWithdrawalTrigger',
  'volunataryDisconnecter',
  'vaultConfiguration',
] as const;

export const NO_MANAGER_PERMISSION_LIST: VAULTS_NO_ROLES[] = [
  'feeExemptRole',
  'unguaranteedDepositRole',
  'proveUnknownValidatorsRole',
] as const;
