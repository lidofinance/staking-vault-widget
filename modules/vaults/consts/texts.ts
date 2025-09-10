import { formatBalance } from 'utils';

type LidoToken = 'stETH' | 'wstETH';

type ExternalToken = 'ETH' | 'wETH';

type ConfirmAction = 'Setting' | 'Proposing';

const balance = (amount?: bigint | null, fallback = '') =>
  amount ? formatBalance(amount).trimmed + ' ' : fallback;

// This structure contains texts related to vault functionality
// such texts for actions, metrics, roles and etc
export const vaultTexts = {
  // configuration for transactions and forms
  actions: {
    approve: {
      loading: (token: LidoToken) => `Approving ${token}` as const,
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
        nodeOperatorFeeRate: {
          title: 'Node Operator Fee',
          label: 'Node Operator fee, %',
          hint: 'The share of Gross staking rewards that the Node Operator charges for provided validation service.\nMandatory parameter, [0% .. 100.00%].',
        },
        confirmationLifetime: {
          title: 'Confirmation Lifetime',
          label: 'Confirmation Lifetime, hours',
          hint: 'The main parameter of the “Multi-role confirmation” mechanism. This mechanism is used for editing some of the stVault parameters via finding consensus between two representatives of the stVault: the Vault Owner and the Node Operator Manager.\nMandatory parameter, hours [24h .. 720h (30 days)].\nIn this mechanism, the first representative initiates changing the parameter, and another representative confirms the change within the period of time equal to the Confirmation Lifetime value.\nUsed for:\n - Node Operator Fee\n - Confirmation Lifetime',
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
      available: `Available to mint`,
      loading: (token: LidoToken) => `Minting ${token}` as const,
      completed: (token: LidoToken) => `${token} minted` as const,
      recipientLabel: 'Mint to address',
      submit: (token: LidoToken, amount?: bigint | null) =>
        `Mint ${balance(amount)}${token}` as const,
    },
    repay: {
      available: `Available to repay`,
      loading: (token: LidoToken) => `Repaying ${token}` as const,
      completed: (token: LidoToken) => `Repaid ${token} ` as const,
      submit: (token: LidoToken, amount?: bigint | null) =>
        `Repay ${balance(amount)}${token}` as const,
    },
    supply: {
      available: `Available to supply`,
      mint: {
        isMint: 'Mint max available stETH',
        mintTo: 'Mint to address',
      },
      submit: {
        supply: (token: ExternalToken, amount?: bigint | null) =>
          `Supply ${balance(amount)}${token}` as const,
        supplyMint: (
          token: ExternalToken,
          amount?: bigint | null,
          amountSteth?: bigint | null,
        ) =>
          `Supply ${balance(amount)}${token} & Mint ${balance(amountSteth)}stETH` as const,
      },
      loading: 'Supplying ETH into the vault',
      completed: 'ETH supplied',
    },
    withdraw: {
      available: `Available to withdraw`,
      loading: ' Withdrawing ETH from the vault',
      completed: 'ETH withdrawn',
      submit: (token: ExternalToken, amount?: bigint | null) =>
        `Withdraw ${balance(amount)}${token}` as const,
    },
    claim: {
      available: `Available to claim`,
      addressLabel: `Rewards address`,
      claimButton: (claimableAmount?: bigint | null) =>
        `Claim ${balance(claimableAmount)}ETH` as const,
      notEnoughEther: `Not enough unlocked ETH to claim` as const,
      loading: `Claiming node operator fee`,
      completed: `Claimed node operator fee`,
    },
    report: {
      loading: 'Applying oracle report',
    },
    weth: {
      loadingUnwrap: 'Unwrapping wETH',
      loadingWrap: 'Wrapping ETH to wETH',
    },
    tier: {
      fields: {
        vaultTotalMintingCapacityStETHValue: {
          title: 'stVault minting capacity',
        },
        vaultUtilizationRatioValue: {
          title: 'Utilization',
        },
        vaultReserveRatioValue: {
          title: 'Reserve ratio',
        },
        vaultRebalanceThresholdValue: {
          title: 'Forced rebalance threshold',
        },
        vaultLidoInfraFeeValue: {
          title: 'Lido infrastructure fee',
        },
        vaultLidoLiquidityFeeValue: {
          title: 'Lido liquidity fee',
        },
        vaultTotalValueETHValue: {
          title: 'Total value',
        },
        vaultLiabilityStETHValue: {
          title: 'Liability',
        },
      },
      settingsTitle: 'Tier settings',
      requestTitle: 'Request moving to',
      vaultMetricsTitle: 'Current vault metrics',
      request: {
        showButton: {
          show: 'See details',
          review: 'Review request',
          hide: 'Hide details',
        },
      },
      inputMintingLimit: {
        titleCurrent: 'stVault minting limit',
        titleNew: 'Enter stVault minting limit',
        errors: {
          max: (max: bigint) =>
            `Requested minting limit exceeds ${formatBalance(max).trimmed} stETH. Reduce the amount or select another tier.`,
        },
      },
      vaultMintingLimit: {
        errors: {
          lessThanVaultLiability:
            'Requested minting limit is less than current stETH liability',
        },
      },
    },
    settings: {
      title: 'Main settings',
      rolesGrantLoading: (roleCount: number) => {
        const suffix = roleCount > 1 ? 's' : '';
        return `Granting ${roleCount} role${suffix}` as const;
      },
      rolesRevokeLoading: (roleCount: number) => {
        const suffix = roleCount > 1 ? 's' : '';
        return `Revoking ${roleCount} role${suffix}` as const;
      },
      confirmNoFee: (action: ConfirmAction, feePercent: number) =>
        `${action} ${feePercent}% Node Operator fee` as const,
      confirmExpiry: (action: ConfirmAction, expiryHours: number) =>
        `${action} ${expiryHours} hours Confirmation Lifetime` as const,
      confirmSelectedTier: (tierId: string, tierMintingLimit: string) =>
        `You’re requesting to move stVault to Tier ${tierId} with a ${tierMintingLimit} minting limit.` as const,
      approveSelectedTier: (tierId: bigint) =>
        `Approving Tier ${tierId} settings.` as const,
      submit: (counter: number) => {
        if (counter > 0)
          return `Submit ${counter} transaction${counter > 1 ? 's' : ''}`;
        return 'No changes';
      },
      nodeOperatorFeeRecipient: 'Setting node operator fee recipient address',
      fields: {
        nodeOperator: {
          title: 'Node Operator',
          hint: 'The address of the Node Operator that provides validation service for the stVault.\nNode Operator handles depositing ETH from the stVault balance to validators and exiting validators if necessary.\nIt can’t be changed after the stVault is created.',
        },
        nodeOperatorFeeRecipient: {
          title: 'Node Operator Fee Recipient',
          editLabel: 'Set new address',
          hint: 'The address of the Node Operator Fee Recipient that has opportunity to claim fees.',
        },
        nodeOperatorFeeRate: {
          title: 'Node Operator Fee',
          label: 'Node Operator fee, %',
          editLabel: 'Propose new, %',
          hint: 'The share of Gross staking rewards that the Node Operator charges for provided validation service.\nMandatory parameter, [0% .. 100.00%].',
        },
        confirmationLifetime: {
          title: 'Confirmation Lifetime',
          label: 'Confirmation Lifetime, hours',
          editLabel: 'Propose new, hours',
          hint: 'The main parameter of the “Multi-role confirmation” mechanism. This mechanism is used for editing some of the stVault parameters via finding consensus between two representatives of the stVault: the Vault Owner and the Node Operator Manager.\nMandatory parameter, hours [24h .. 720h (30 days)].\nIn this mechanism, the first representative initiates changing the parameter, and another representative confirms the change within the period of time equal to the Confirmation Lifetime value.\nUsed for:\n- Node Operator Fee\n- Confirmation Lifetime',
        },
        vaultManager: {
          title: 'Vault Owner',
          label: 'Vault Owner address',
          editLabel: 'Vault Owner address',
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
      clearChanges: 'Clear changes',
    },
  },
  // configuration for vault metrics as seen in overview page
  // but can be used in other places as well where vault status is displayed
  metrics: {
    capacityExceeded: {
      title: 'stETH minting balance exceeded',
      description:
        'The stVault stETH minting balance constrained by the Reserve Ratio has exceeded, indicating imbalance in collaterization of stETH Liability. You are strongly recommended to take one of the following actions:',
      note: 'Note: Rebalance allows Supply ETH and Repay stETH in one batch transaction',
      actions: [
        {
          name: 'supply',
          title: 'Increase Total Value',
          getText: (amount: string) => `Supply ${amount}`,
        },
        {
          name: 'repay',
          title: 'Decrease stETH Liability',
          getText: (amount: string) => `Repay ${amount}`,
        },
        {
          name: 'rebalance',
          title: 'Decrease Total Value and stETH Liability',
          getText: (amount: string) => `Rebalance ${amount}`,
        },
      ],
    },
    thresholdExceeded: {
      title: 'Forced rebalance threshold exceeded',
      description:
        "The stVault forced rebalance threshold exceeded, and the permissionless rebalance mechanism is activated for this stVault. It means the stVault can be rebalanced at any moment in time. You can still restore the vault health factor by taking one of the following actions. There is no guarantee that the permissionless rebalancing won't be performed before your transaction.",
      note: 'Note: Rebalance allows Supply ETH and Repay stETH in one batch transaction',
      actions: [
        {
          name: 'supply',
          title: 'Increase Total Value',
          getText: (amount: string) => `Supply ${amount}`,
        },
        {
          name: 'repay',
          title: 'Decrease stETH Liability',
          getText: (amount: string) => `Repay ${amount}`,
        },
        {
          name: 'rebalance',
          title: 'Decrease Total Value and stETH Liability',
          getText: (amount: string) => `Rebalance ${amount}`,
        },
      ],
    },
    connectVault: {
      title: 'Connect stVault to Lido VaultHub',
      description:
        'This stVault is requested to connect to Lido VaultHub to enable stETH minting and accounting, with pre-selected stETH minting terms and Lido fees.',
      listTitle: 'By signing this transaction, you agree to:',
      list: [
        '1. Approve connection to Lido VaultHub;',
        '2. Enable Tier 1 terms and fees;',
        '3. Supply 1 ETH as collateral (refundable if disconnected from Lido VaultHub)',
      ],
      action: 'Approve and supply 1 ETH',
    },
    general: {
      nodeOperator: 'Node operator',
      nodeOperatorFeeRate: 'Node operator fee',
      reserveRatio: 'reserve ratio',
      tier: {
        connected: 'Tier',
        notConnected: 'Not connected',
      },
      action: 'Request to change',
    },
    totalValueETH: {
      title: 'Total value',
      hint: 'The total amount of ETH deposited on validators and on the vault balance.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    totalValue: {
      title: 'Total value',
      hint: 'The total amount of ETH deposited on validators and on the vault balance.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    reserveRatio: {
      title: 'Reserve ratio',
      hint: 'Defines amount of ETH that will be reserved as a part of collateral when the vault owner mints stETH in the vault.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    withdrawableEth: {
      title: 'Available for Immediate Withdrawal',
      hint: 'The amount of ETH that is available to withdraw from the vault balance. Constrained by the total locked ETH on the vault and the amount of ETH deposited on validators.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    withdrawableEther: {
      title: 'Available for Immediate Withdrawal',
      hint: 'The amount of ETH that is available to withdraw from the vault balance. Constrained by the total locked ETH on the vault and the amount of ETH deposited on validators.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    healthFactorNumber: {
      title: 'Health factor',
      hint: 'Health Factor of the vault that demonstrates the economic state of the vault. It shows how the stETH Liability is collateralized by Total value.\nThe Health Factor value equal to 100% is defined by the Forced Rebalance Threshold meaning that on the Health Factor falling under 100% the vault becomes subject to forced rebalancing.',
      description:
        'Health Factor of the vault that demonstrates the economic state of the vault. It shows how the stETH Liability is collateralized by Total value.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    vaultLiability: {
      title: 'stETH Liability',
      hint: 'The amount of stETH that the vault owner minted in the vault backed by the ETH collateral. Increases daily due to daily stETH rebase.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    liabilityStETH: {
      title: 'stETH Liability',
      hint: 'The amount of stETH that the vault owner minted in the vault backed by the ETH collateral. Increases daily due to daily stETH rebase.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    rebalanceThreshold: {
      title: 'Forced rebalance threshold',
      hint: 'Defines the minimum allowed ratio stETH Liability to Total value. Exceeding this minimum threshold makes the vault subject to forced rebalancing.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    utilizationRatio: {
      title: 'Utilization ratio',
      hint: 'The share of the stETH minting balance currently utilized by the vault owner',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    totalMintingCapacityStETH: {
      title: 'Total minting balance',
      hint: 'The amount of stETH the vault owner can mint within the Reserve Ratio boundaries. Also limited by the stETH minting limit.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    balanceEth: {
      title: 'Not staked stVault Balance',
      hint: 'The amount of ETH held on the vault balance and not deposited on validators therefore not used for earning rewards.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    balance: {
      title: 'Not staked stVault Balance',
      hint: 'The amount of ETH held on the vault balance and not deposited on validators therefore not used for earning rewards.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    totalLocked: {
      title: 'Total Lock',
      hint: 'Total amount of ETH locked in the vault due to combination of reasons: unclaimed fees, collateral for stETH liability, etc.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    collateral: {
      title: 'Collateral',
      hint: 'The amount of ETH locked in the vault because of stETH Liability considering Reserve Ratio, or due to the vault connection to Lido Core (min 1 ETH).',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    pendingUnlockEth: {
      title: 'Pending unlock',
      hint: 'The amount of ETH that should be unlocked because of repaid stETH but waiting for the confirmation from the upcoming Oracle report.  ',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    nodeOperatorFeeRate: {
      title: 'Node Operator Fee',
      hint: 'The share of Gross staking rewards that the Node Operator charges for provided validation service.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    undisbursedNodeOperatorFee: {
      title: 'Undisbursed Node Operator fee',
      hint: 'The amount of accumulated but not yet disbursed Node Operator Fee. This amount of ETH increases the amount of total locked ETH.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    unsettledLidoFees: {
      title: 'Unsettled Lido fees',
      hint: 'The amount of accumulated but not yet settled Lido fees. This amount of ETH increases the amount of total locked ETH.\n\nLido fee consists of the following components, calculated daily and automatically settled by Lido whenever a vault report is applied.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    netApr: {
      title: 'Net staking APR',
      hint: 'Estimated yearly returns from staking in the vault, after fees deductions but without taking into account stETH Liability growth due to stETH rebase.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    modals: {
      health: {
        rebalanceThreshold: {
          description:
            'The Health factor value equal to 100% is defined by the Forced rebalance threshold meaning that on the Health factor falling under 100% the vault becomes subject to forced rebalancing.',
        },
        carrySpread: {
          title: 'Carry Spread',
          description:
            'Estimated yearly returns from staking in the vault, after deductions of fees and stETH Liability growth due to stETH rebase.',
        },
        bottomLine: {
          title: 'stVault bottom line',
          description:
            'The final amount of rewards earned by the vault owner in the vault perimeter.  Calculated as difference between the Net Staking Rewards and the stETH Liability growth:',
        },
        netStakingRewards: {
          title: 'Net staking rewards',
          description:
            'The amount of staking rewards remain after deductions of Node Operator Fee and Lido fees.',
        },
        stethRebase: {
          title: 'stETH Rebase',
          description:
            'The change of stETH amount happening due to stETH is a rebasing token. Amount for rebase is based o the stETH APR.',
        },
      },
      withdrawal: {
        totalValue: {
          title: 'Total Value',
          description:
            'The amount of ETH deposited on validators and used for earning rewards.',
        },
        availableForWithdrawal: {
          title: 'Available for Immediate Withdrawal',
          description:
            'Immediately available to withdraw ETH is limited by Collateral and Obligations, as well as current stVault Balance.',
        },
      },
      netApr: {
        netStakingRewards: {
          title: 'Net staking rewards',
          description:
            'The amount of staking rewards remain after deductions of Node Operator Fee and Lido fees.',
        },
        grossStakingRewards: {
          title: 'Gross staking rewards',
          description:
            'The amount of rewards earned by the validators expressed as a percentage of the vault total value, before fees deductions.',
        },
        noFee: {
          title: 'Node Operator Fee',
          description:
            'The share of Gross staking rewards that the Node Operator charges for provided validation service.',
        },
        lidoFees: {
          title: 'Lido fees',
          description:
            'The amount of accumulated but not yet claimed Lido fees. This amount of ETH increases the amount of total locked ETH.',
        },
      },
      liabilityStETH: {
        utilizationRatio: {
          title: 'Utilization Ratio',
          description:
            'The share of the stETH minting capacity currently utilized by the vault owner.',
        },
        totalStethMintingCapacity: {
          title: 'Total stETH minting capacity',
          constrainedBy: (
            constraintBy: 'reserveRatio' | 'vault' | 'lido' | 'tier' | 'group',
          ) => {
            switch (constraintBy) {
              case 'reserveRatio':
                return 'constrained by Reserve Ratio';
              case 'vault':
                return 'constrained by Vault Share Limit';
              case 'lido':
                return 'constrained by Lido TVL';
              case 'tier':
                return 'constrained by Vault Tier';
              case 'group':
                return 'constrained by NO Group Limit';
            }
          },
          description:
            'The amount of stETH the Vault Owner can mint within the Reserve Ratio boundaries. Also limited by the stETH minting limit.',
        },
        stethMintingLimit: {
          title: 'stETH minting limit',
          description:
            'Absolute maximum limit for the stETH minting capacity defined by the Tier the vaults belong to. It can be changed by changing the Tier.',
        },
        remainingCapacity: {
          title: 'Remaining capacity',
          description:
            'The amount of stETH remaining mintable in the vault, based on the current Total stETH minting capacity and stETH Liability.',
        },
        reserveRatio: {
          title: 'Reserve Ratio',
          description:
            'Defines amount of ETH that will be reserved as a part of collateral when the vault owner mints stETH in the vault.',
        },
        forcedRebalanceThreshold: {
          title: 'Forced Rebalance Threshold',
          description:
            'Defines the minimum allowed ratio stETH Liability to Total Value. Exceeding this minimum threshold makes the vault subject to forced rebalancing.',
        },
      },
    },
  },
  // configuration for vault roles
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
    volunataryDisconnecter: {
      title: 'Voluntary disconnect Vault from Lido Vault Hub',
      hint: 'Allows voluntary disconnecting stVault from the Lido Vault Hub.',
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
  },
  // common texts like errors, warnings, etc.
  common: {
    errors: {
      amount: {
        required: 'Amount is required',
        min: (min: bigint) =>
          `Amount must be greater than ${formatBalance(min).trimmed}` as const,
        overBalance: (token: ExternalToken | LidoToken) =>
          `Amount exceeds ${token} balance` as const,
        max: (max: bigint) =>
          `Amount must be less than  ${formatBalance(max).trimmed}` as const,
      },
      address: {
        required: 'Address is required',
        invalid: 'Invalid ethereum address',
        vault: 'Recipient cannot be stVault',
        dashboard: 'Recipient cannot be stVault Dashboard',
      },

      duplicate: 'Value already exists',
      noRoles: (roleNames: string[]) =>
        `You don't have ${roleNames.join(',')} role${roleNames.length > 1 ? 's' : ''}` as const,

      vault: {
        loadingVault: 'Error loading stVault',
        vaultAddress: 'Invalid stVault address',
        notDashboard: 'stVault is not owned by Dashboard contract',
        reportMissing:
          'Report for your stVault is not available. Try again later.',
      },
    },
    form: {
      willReceiveLabel: 'You will receive',
    },
    links: {
      goToAll: 'To All Vaults',
    },
    tokens: {
      ETH: 'ETH',
      wETH: 'wETH',
      stETH: 'stETH',
      wstETH: 'wstETH',
    },
  },
} as const;
