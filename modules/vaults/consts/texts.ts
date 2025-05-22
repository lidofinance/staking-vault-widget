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
      steps: ['Main settings', 'Verify new vault’s settings'],
      fields: {
        nodeOperator: {
          title: 'Node Operator',
          label: 'Node Operator address',
          notes:
            'Node Operator address cannot be changed after the vault is created',
          hint: 'The address of the Node Operator that provides validation service for the stVault.\nNode Operator handles depositing ETH from the stVault balance to validators and exiting validators if necessary.\nIt can’t be changed after the stVault is created.',
        },
        nodeOperatorFee: {
          title: 'Node Operator Fee',
          label: 'Node Operator fee, %',
          hint: 'The share of Gross staking rewards that the Node Operator charges for provided validation service.\nMandatory parameter, [0% .. 100.00%].',
        },
        confirmationLifetime: {
          title: 'Confirmation Lifetime',
          label: 'Confirmation Lifetime, hours',
          hint: 'The time period in which the Node Operator has to confirm the report.\nMandatory parameter, [0 hours .. 24 hours].\nIf the Node Operator does not confirm the report within this time period, it will be automatically confirmed.',
        },
        vaultManager: {
          title: 'Vault Manager',
          label: 'Vault Manager address',
          hint: 'One of the two admin roles for the stVault. Allows to manage permissions and change key vault parameters from the Vault Owner (Staker) perspective.\nMultiple addresses supported.',
        },
        nodeOperatorManager: {
          title: 'Node Operator Manager',
          label: 'Node Operator Manager address',
          hint: 'One of the two admin roles for the stVault. Allows to manage permissions and change key vault parameters from the Node Operator perspective.\nMultiple addresses supported.',
        },
        acceptTerms: {
          notes: 'Vault creation requires a supply of 1 ETH.',
        },
      },
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
