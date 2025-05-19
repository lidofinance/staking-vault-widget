import { keccak256, toHex, zeroHash } from 'viem';

const toRoleHash = (role: string) => keccak256(toHex(role));

type PermissionEntry<TRolesMap> = {
  role: keyof TRolesMap;
  title: string;
  tooltip: string;
};

export const VAULTS_ROOT_ROLES_MAP = {
  defaultAdmin: zeroHash,
  nodeOperatorManager: toRoleHash(
    'vaults.NodeOperatorFee.NodeOperatorManagerRole',
  ),
} as const;

export type VAULT_ROOT_ROLES = keyof typeof VAULTS_ROOT_ROLES_MAP;

export const VAULTS_OWNER_ROLES_MAP = {
  supplier: toRoleHash('vaults.Permissions.Fund'),
  withdrawer: toRoleHash('vaults.Permissions.Withdraw'),
  locker: toRoleHash('vaults.Permissions.Lock'),
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

export type VAULT_OWNER_ROLES = keyof typeof VAULTS_OWNER_ROLES_MAP;

export const VAULTS_NO_ROLES_MAP = {
  nodeOperatorFeeClaimer: toRoleHash('vaults.NodeOperatorFee.FeeClaimRole'),
  nodeOperatorRewardsAdjuster: toRoleHash(
    'vaults.NodeOperatorFee.RewardsAdjustRole',
  ),
} as const;

export type VAULTS_NO_ROLES = keyof typeof VAULTS_NO_ROLES_MAP;

export const VAULT_MANAGER_PERMISSIONS_LIST: PermissionEntry<
  typeof VAULTS_OWNER_ROLES_MAP
>[] = [
  {
    role: 'supplier',
    title: 'Supply ETH',
    tooltip: 'Allows Supplying ETH to stVault',
  },
  {
    role: 'withdrawer',
    title: 'Withdraw ETH',
    tooltip: 'Allows Withdrawing unlocked ETH from stVault',
  },
  {
    role: 'minter',
    title: 'Mint stETH',
    tooltip: 'Allows Minting stETH (considering ReserveRatio)',
  },
  {
    role: 'repayer',
    title: 'Repay stETH',
    tooltip: 'Allows Repaying stETH',
  },
  {
    role: 'depositsPauser',
    title: 'Pause Deposits to Validators',
    tooltip:
      'Allows pausing beacon chain deposits to Validators keeping available ETH on the stVault balance.',
  },
  {
    role: 'depositsResumer',
    title: 'Resume Deposits to Validators',
    tooltip:
      'Allows unpausing beacon chain deposits to Validators from stVault balance',
  },

  {
    role: 'validatorWithdrawalTrigger',
    title: 'Force Withdrawals of ETH from Validator',
    tooltip:
      'Allows forced withdrawing ETH from validator and returning it to Vault balance.',
  },
  {
    role: 'validatorExitRequester',
    title: 'Request Node Operator to Exit Validator',
    tooltip:
      'Allows creating a request for Node Operator to exit a validator and return all ETH from this validator to the Vault balance.',
  },
  {
    role: 'rebalancer',
    title: 'Re-balance unhealthy Vault',
    tooltip: 'Allows rebalancing stVault if Health rate < 100%.',
  },
  {
    role: 'volunataryDisconnecter',
    title: 'Voluntary disconnect Vault from Lido Vault Hub',
    tooltip: 'Allows voluntary disconnecting stVault from the Lido Vault Hub.',
  },
  {
    role: 'assetRecoverer',
    title: 'Recover tokens from Dashboard contract',
    tooltip: 'Allows to recover ERC20 & NFTs from the Dashboard contract.',
  },
  {
    role: 'depositorSetter',
    title: 'Set vault depositor in unconnected stVault',
    tooltip:
      'Allows to change the vault depositor when not connected to Lido Vault Hub.',
  },
  {
    role: 'locker',
    title: 'Increase lock amount in vault',
    tooltip:
      'Allows to increase locked ETH amount on stVault to allow stETH minting',
  },
  {
    role: 'lockResetter',
    title: 'Reset lock amount in unconnected stVault',
    tooltip:
      'Allows to reset locked amount when not connected to Lido Vault Hub.',
  },
  {
    role: 'ossifyer',
    title: 'Ossify vault',
    tooltip:
      'Allows to ossify vault implementation when not connected to Lido Vault Hub. Prevents changes to the vault implementation.',
  },

  {
    role: 'pdgCompensater',
    title: 'Compensate disproven validator in PDG',
    tooltip:
      'Allows to return predeposted ETH from validator if it was proven invalid in PDG',
  },

  {
    role: 'pdgProver',
    title: 'Prove unknown validator in PDG',
    tooltip: 'Allows to prove validators with correct credentials to PDG ',
  },

  {
    role: 'unguaranteedDepositor',
    title: 'Perform unguaranteed deposit to beacon chain',
    tooltip:
      'Allows to withdraw vault funds and perform unguaranteed deposit to beacon chain',
  },
  {
    role: 'tierChangeRequester',
    title: 'Request tier change in Operator Grid',
    tooltip: 'Allows to request tier change in Operator Grid',
  },
  {
    role: 'vaultHubAuthorizer',
    title: 'Authorize Lido VaultHub to the vault',
    tooltip: 'Authorize the stVault to be connected to the Lido Vault Hub.',
  },
  {
    role: 'vaultHubDeathorizer',
    title: 'Deauthorize Lido VaultHub to the vault',
    tooltip: 'Allows to deauthorize Lido VaultHub to the vault',
  },
];

export const NO_MANAGER_PERMISSION_LIST: PermissionEntry<
  typeof VAULTS_NO_ROLES_MAP
>[] = [
  {
    role: 'nodeOperatorFeeClaimer',
    title: 'ClaimPage Node Operator’s Accumulated Fees',
    tooltip:
      'Allows claiming accumulated Node Operator’s fee. Claimer provides an address to receive fees.',
  },
  {
    role: 'nodeOperatorRewardsAdjuster',
    title: 'Adjust Node Operator’s Rewards',
    tooltip:
      'Allows to adjust accrued rewards(due to side deposits or consolidations) to decrease claimable fee',
  },
];

export const VAULTS_ALL_ROLES_MAP = {
  ...VAULTS_ROOT_ROLES_MAP,
  ...VAULTS_OWNER_ROLES_MAP,
  ...VAULTS_NO_ROLES_MAP,
} as const;

export type VAULTS_ALL_ROLES = keyof typeof VAULTS_ALL_ROLES_MAP;

export const VAULTS_ALL_ROLES_LIST = Object.keys(
  VAULTS_ALL_ROLES_MAP,
) as VAULTS_ALL_ROLES[];
