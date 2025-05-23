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
          hint: 'One of the two admin roles for the stVault. Allows to manage permissions and change key vault parameters from the Node Operator perspective.',
        },
        acceptTerms: {
          label:
            'I confirm that I’ve read and agree:\n •  with the fees structure\n •  mechanisms applied in extreme scenarios',
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
      fields: {
        nodeOperator: {
          title: 'Node Operator',
          hint: 'The address of the Node Operator that provides validation service for the stVault.\nNode Operator handles depositing ETH from the stVault balance to validators and exiting validators if necessary.\nIt can’t be changed after the stVault is created.',
        },
        nodeOperatorFee: {
          title: 'Node Operator Fee',
          label: 'Node Operator fee, %',
          editLabel: 'Propose new Node Operator fee, %',
          hint: 'The share of Gross staking rewards that the Node Operator charges for provided validation service.\nMandatory parameter, [0% .. 100.00%].',
        },
        confirmationLifetime: {
          title: 'Confirmation Lifetime',
          label: 'Confirmation Lifetime, hours',
          editLabel: 'Propose new Confirmation Lifetime, hours',
          hint: 'The time period in which the Node Operator has to confirm the report.\nMandatory parameter, [0 hours .. 24 hours].\nIf the Node Operator does not confirm the report within this time period, it will be automatically confirmed.',
        },
        vaultManager: {
          title: 'Vault Manager',
          label: 'Vault Manager address',
          editLabel: 'Vault Manager address',
          actionText: 'Add new address',
          hint: 'One of the two admin roles for the stVault. Allows to manage permissions and change key vault parameters from the Vault Owner (Staker) perspective.\nMultiple addresses supported.',
        },
        nodeOperatorManager: {
          title: 'Node Operator Manager',
          label: 'Node Operator Manager address',
          editLabel: 'Node Operator Manager address',
          actionText: 'Add new address',
          hint: 'One of the two admin roles for the stVault. Allows to manage permissions and change key vault parameters from the Node Operator perspective.\nMultiple addresses supported.',
        },
      },
    },
  },
  metrics: {
    totalValue: {
      title: 'Total value',
      hint: 'The total amount of ETH deposited on validators and on the vault balance.',
      action: 'Supply ETH',
    },
    reserveRatio: {
      title: 'Reserve ratio',
      hint: 'Defines amount of ETH that will be reserved as a part of collateral when the vault owner mints stETH in the vault.',
    },
    withdrawableEth: {
      title: 'Available to withdraw',
      action: 'Withdraw ETH',
      hint: 'The amount of ETH that is available to withdraw from the vault balance. Constrained by the total locked ETH on the vault and the amount of ETH deposited on validators.',
    },
    healthFactorNumber: {
      title: 'Health factor',
      hint: 'Health Factor of the vault that demonstrates the economic state of the vault. It shows how the stETH Liability is collateralized by Total value.\nThe Health Factor value equal to 100% is defined by the Forced Rebalance Threshold meaning that on the Health Factor falling under 100% the vault becomes subject to forced rebalancing.',
    },
    liabilityStETH: {
      title: 'stETH liability',
      hint: 'The amount of stETH that the vault owner minted in the vault backed by the ETH collateral. Increases daily due to daily stETH rebase.',
    },
    rebalanceThreshold: {
      title: 'Forced rebalance threshold',
      hint: 'Defines the minimum allowed ratio stETH Liability to Total value. Exceeding this minimum threshold makes the vault subject to forced rebalancing.',
    },
    utilizationRatio: {
      title: 'Utilization ratio',
      hint: 'The share of the stETH minting capacity currently utilized by the vault owner',
    },
    totalMintingCapacityStETH: {
      title: 'Total minting capacity',
      hint: 'The amount of stETH the vault owner can mint within the Reserve Ratio boundaries. Also limited by the stETH minting limit.',
    },
    balanceEth: {
      title: 'Idle capital',
      action: 'Supply ETH',
      hint: 'The amount of ETH held on the vault balance and not deposited on validators therefore not used for earning rewards.',
    },
    totalLocked: {
      title: 'Total Lock',
      // TODO: support link
      hint: 'Total amount of ETH locked in the vault due to combination of reasons: unclaimed fees, collateral for stETH liability, etc.',
    },
    collateral: {
      title: 'Collateral',
      hint: 'The amount of ETH locked in the vault because of stETH Liability considering Reserve Ratio, or due to the vault connection to Lido Core (min 1 ETH).',
    },
    pendingUnlockEth: {
      title: 'Pending unlock',
      hint: 'The amount of ETH that should be unlocked because of repaid stETH but waiting for the confirmation from the upcoming Oracle report.  ',
    },
    nodeOperatorFee: {
      title: 'Node Operator Fee',
      hint: 'The share of Gross staking rewards that the Node Operator charges for provided validation service.',
    },
    accumulatedFee: {
      title: 'Unclaimed Node Operator Fee',
      hint: 'The amount of accumulated but not yet claimed Node Operator Fee. This amount of ETH increases the amount of total locked ETH.',
      action: 'Claim',
    },
  },
  roles: {
    defaultAdmin: {
      title: 'Vault Owner',
      hint: 'One of two admin roles for the stVault. Allows to manage permissions and change key Vault parameters.\nVault Manager role can be considered as Vault Owner for the User.\nMultiple addresses supported.',
    },
    nodeOperatorManager: {
      title: 'Node Operator Manager',
      hint: 'One of two admin roles for the stVault. Allows to manage permissions and change key Vault parameters from the Node Operator perspective.\nMultiple addresses supported',
    },
    supplier: {
      title: 'Supply ETH',
      hint: 'Allows Supplying ETH',
    },
    withdrawer: {
      title: 'Withdraw ETH',
      hint: 'Allows Withdrawing unlocked ETH from stVault',
    },
    depositsPauser: {
      title: 'Pause Deposits to Validators',
      hint: 'Allows requesting the Node Operator to pause deposits to Validators to keep available ETH on the Vault balance.',
    },
    depositsResumer: {
      title: 'Resume Deposits to Validators',
      hint: 'Allows informing the Node Operator that deposits to Validators can be resumed.',
    },
    validatorWithdrawalTrigger: {
      title: 'Force Withdrawals of ETH from Validator',
      hint: 'Allows forced withdrawing ETH from validator and returning it to Vault balance.',
    },
    validatorExitRequester: {
      title: 'Request Node Operator to Exit Validator',
      hint: 'Allows creating a request for Node Operator to exit a validator and return all ETH from this validator to the Vault balance.',
    },
    rebalancer: {
      title: 'Re-balance unhealthy Vault',
      // TODO: link support
      hint: 'Allows rebalancing stVault if Health rate < 100%',
    },
    minter: {
      title: 'Mint stETH',
      hint: 'Allows Minting stETH (considering ReserveRatio)',
    },
    repayer: {
      title: 'Repay stETH',
      hint: 'Allows Repaying stETH',
    },
    vaultHubAuthorizer: {
      title: 'Authorize for connection to Lido Vault Hub',
      hint: 'Authorize the stVault to be connected to the Lido Vault Hub',
    },
    vaultHubDeathorizer: {
      title: 'De-authorize for connection to Lido Vault Hub',
      hint: 'De-authorize the stVault to be connected to the Lido Vault Hub.',
    },
    volunataryDisconnecter: {
      title: 'Voluntary disconnect Vault from Lido Vault Hub',
      hint: 'Allows voluntary disconnecting stVault from the Lido Vault Hub.',
    },
    depositorSetter: {
      title:
        'Set depositor for the stVault disconnected from the Lido Vault Hub',
      hint: 'Set depositor for the stVault disconnected from the Lido Vault Hub.',
    },
    ossifyer: {
      title: 'Ossify vault',
      // TODO: support bold
      hint: 'Permission for ossifying the stVault: irreversible forbid to be connected to the Lido Vault Hub.',
    },
    lockResetter: {
      title: 'Reset locked amount of ETH on the disconnected stVault',
      hint: 'Permission for resetting locked amount on the disconnected stVault.',
    },
    pdgProver: {
      title: 'Prove the validator to PDG',
      hint: 'If validator exists on the Beacon Chain, user can prove this validator to PDG.',
    },
    pdgCompensater: {
      title: 'Compensate 1 ETH for disproven validator',
      hint: 'In a case of disproven pre-deposit on validator, transfer unlocked 1 ETH from PDG bond to the specified address.',
    },
    unguaranteedDepositor: {
      title: 'Unguaranteed deposit to validators',
      hint: 'Direct and unguaranteed deposit ETH from the vault balance to validators.\nThis deposit is performed outside Pre-Deposit Guarantee contract so the operation is vulnerable.',
    },
    tierChangeRequester: {
      title: 'Request to change the stVault tier',
      hint: 'Allows requesting Node Operator to change the stVaults tier',
    },
    assetRecoverer: {
      title: 'Withdraw tokens wrongly transferred to the Dashboard contract',
      hint: 'Allows to recover ERC20 & NFTs from the Dashboard contract.',
    },

    nodeOperatorFeeClaimer: {
      title: 'Claim Node Operator’s Accumulated Fees',
      hint: 'Allows claiming accumulated Node Operator’s fee.\nClaimer provides an address to receive fees.',
    },
    nodeOperatorRewardsAdjuster: {
      title: 'Adjust rewards on the validators',
      hint: 'ETH added outside stVaults mechanisms is treated as rewards and subject to Node Operator Fee unless marked as deposit.',
    },

    // NOT IN THE DOC AND WILL BE DELETED IN CONTRACTS
    locker: {
      title: 'Increase lock amount in vault',
      hint: 'Allows to increase locked ETH amount on stVault to allow stETH minting',
    },
  },
} as const;
