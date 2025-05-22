type Token = 'stETH' | 'wstETH';

type ConfirmAction = 'Setting' | 'Proposing';

export const vaultTexts = {
  actions: {
    approve: {
      loading: (token: Token) => `Approving ${token}` as const,
    },
    createVault: {
      loading: 'Creating vault',
      completed: 'Vault created',
    },
    mint: {
      loading: (token: Token) => `Minting ${token}` as const,
      completed: (token: Token) => `${token} minted` as const,
    },
    repay: {
      loading: (token: Token) => `Repaying ${token}` as const,
      completed: (token: Token) => `Repaid ${token} ` as const,
    },
    supply: {
      loading: 'Supplying ETH into the vault',
      completed: 'ETH supplied',
    },
    withdraw: {
      loading: ' Withdrawing ETH from the vault',
      completed: 'ETH withdrawn',
    },
    claim: {
      loading: `Claiming node operator fee`,
      completed: `Claimed node operator fee`,
    },
    report: {
      loading: 'Applying oracle report',
    },
    settings: {
      rolesGrantLoading: (roleCount: number) =>
        `Granting ${roleCount} roles` as const,
      rolesRevokeLoading: (roleCount: number) =>
        `Revoking ${roleCount} roles` as const,
      confirmNoFee: (action: ConfirmAction, feePercent: number) =>
        `${action} ${feePercent}% Node Operator fee` as const,
      confirmExpiry: (action: ConfirmAction, expiryHours: number) =>
        `${action} ${expiryHours} hours Confirmation Lifetime` as const,
    },
  },
  metrics: {},
  roles: {},
} as const;
