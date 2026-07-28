import { formatBalance } from 'utils/formats/format-balance';
import { ONE_ETHER } from 'consts/tx';
import { toStethValue, truncateAddress } from 'utils';

import type { TierConfirmationFnNames } from '../types';

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
    connectVault: {
      connect: 'Awaiting for Vault connection',
      completed: 'Vault connected',
    },
    disconnectVault: {
      voluntaryDisconnect: {
        loading: 'Disconnecting vault from Vault Hub',
        completed: 'Vault disconnected from Vault Hub',
      },
      applyReport: {
        loading: 'Applying report',
        completed: 'Report has been applied',
      },
      abandonDashboard: {
        loading: 'Abandoning dashboard from vault',
        completeActionText: (address: string) =>
          `Ownership suggestion passed to ${truncateAddress({ address })}`,
      },
      acceptOwnership: {
        loading: (address: string) =>
          `Accepting ownership for ${truncateAddress({ address })}`,
        completeActionText: (address: string) =>
          `Vault ownership passed to ${truncateAddress({ address })}`,
      },
      withdraw: {
        loading: 'Withdrawing available stVault balance',
        completed: 'Available stVault balance withdrawn',
        submit: (amount?: bigint | null) =>
          `Withdraw ${balance(amount)}ETH` as const,
        recipientLabel: 'Withdraw to address',
        useOwnerAddress: `Use Vault Owner's address`,
        useAnotherAddress: 'Use another address',
      },
    },
    createVault: {
      loading: 'Creating vault',
      completed: 'Vault created',
      steps: ['Main settings', 'Verify new vault’s settings'],
      fields: {
        nodeOperator: {
          title: 'Node Operator',
          placeholder: '0x...',
          notes:
            'Node Operator address cannot be changed after the vault is created',
          hint: 'The address of the Node Operator that provides validation service for the stVault.\nNode Operator handles depositing ETH from the stVault balance to validators and exiting validators if necessary.\nIt can’t be changed after the stVault is created.',
        },
        feeRate: {
          title: 'Node Operator Fee',
          placeholder: '%',
          hint: 'The share of Gross staking rewards that the Node Operator charges for provided validation service.\nMandatory parameter, [0% .. 100.00%].',
        },
        confirmationLifetime: {
          title: 'Confirmation Lifetime, hours',
          placeholder: 'hours',
          hint: 'The main parameter of the “Multi-role confirmation” mechanism. This mechanism is used for editing some of the stVault parameters via finding consensus between two representatives of the stVault: the Vault Owner and the Node Operator Manager.\nMandatory parameter, hours [24h .. 720h (30 days)].\nIn this mechanism, the first representative initiates changing the parameter, and another representative confirms the change within the period of time equal to the Confirmation Lifetime value.\nUsed for:\n - Node Operator Fee\n - Confirmation Lifetime',
        },
        vaultOwner: {
          title: 'Vault Owner',
          placeholder: '0x...',
          hint: 'One of the two admin roles for the stVault. Allows to manage permissions and change key vault parameters from the Vault Owner (Staker) perspective.\nMultiple addresses supported.',
        },
        nodeOperatorManager: {
          title: 'Node Operator Manager',
          placeholder: '0x...',
          hint: 'One of the two admin roles for the stVault. Allows to manage permissions and change key vault parameters from the Node Operator perspective.',
        },
        lidoCoreConnectionDeposit: {
          title: 'Lido Core connection deposit',
          placeholder: '1 ETH',
          hint: 'Vault creation requires a supply of 1 ETH.',
        },
        acceptTerms: {
          placeholder: 'I confirm that I’ve read and agree with:',
          list: [
            {
              text: 'the',
              linkText: 'fee structure',
              url: 'https://research.lido.fi/t/default-risk-assessment-framework-and-fees-parameters-for-lido-v3-stvaults/10504#p-22550-fees-7',
            },
            {
              text: 'mechanisms applied according to',
              linkText: 'Risk Assessment Framework',
              url: 'https://research.lido.fi/t/default-risk-assessment-framework-and-fees-parameters-for-lido-v3-stvaults/10504',
            },
          ],
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
      repayUnavailable: 'Repay unavailable',
      loading: (token: LidoToken) => `Repaying ${token}` as const,
      completed: (token: LidoToken) => `Repaid ${token} ` as const,
      submit: (token: LidoToken, amount?: bigint | null) =>
        `Repay ${balance(amount)}${token}` as const,
    },
    report: {
      loading: 'Applying oracle report' as const,
      completed: 'Applying oracle report is done' as const,
    },
    overview: {
      vaultGeneral: {
        nodeOperator: {
          verifiedOperator: 'Identified operator',
          unVerifiedOperator:
            'Operator has not passed the identification process',
        },
      },
    },
    settleLidoFees: {
      loading: 'Settling Lido fees',
      completed: 'Settling Lido fees is done',
    },
    supply: {
      available: `Available to supply`,
      mint: {
        isMint: 'Mint max available stETH',
        mintTo: 'Mint to address',
      },
      submit: {
        supplyUnavailable: 'Supply unavailable',
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
      completed: (token: string) => `${token} supplied`,
    },
    withdraw: {
      available: `Available to withdraw`,
      loading: ' Withdrawing ETH from the vault',
      completed: (token: string) => `${token} withdrawn`,
      submit: (token: ExternalToken, amount?: bigint | null) =>
        `Withdraw ${balance(amount)}${token}` as const,
    },
    disburse: {
      title: 'Disburse Node Operator fee',
      available: `Available to disburse`,
      addressLabel: `Rewards address`,
      claimButton: (claimableAmount?: bigint | null) =>
        `Disburse ${balance(claimableAmount)}ETH` as const,
      notEnoughEther: `Not enough unlocked ETH to disburse` as const,
      loading: `Disbursing node operator fee`,
      completed: `Disbursed node operator fee`,
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
      tierVotingTitle: (
        votingType: TierConfirmationFnNames,
        additionalText: string,
      ) => {
        const typeTitles = {
          changeTier: 'Request moving to',
          updateVaultShareLimit: 'Request to change minting limit',
          syncTier: 'Request to update',
        };

        if (['changeTier', 'syncTier'].includes(votingType)) {
          return `${typeTitles[votingType]} ${additionalText}`;
        }

        return typeTitles[votingType];
      },
      vaultMetricsTitle: 'Current vault metrics',
      request: {
        showButton: {
          show: 'See details',
          review: 'Review request',
          hide: 'Hide details',
        },
        approveButton: {
          capacityExceeded:
            'stVault Liability exceeds available Tier stETH capacity.',
          approve: 'Approve',
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
          alreadySet: 'Requested minting limit already set',
        },
      },
    },
    disconnect: {
      settingsTitle: 'stVault Disconnection from VaultHub',
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
      noGuarantorLoading: `Granting PDG Guarantor to the new address` as const,
      noDepositorLoading: `Granting PDG Depositor to the new address` as const,
      confirmNoFee: (action: ConfirmAction, feePercent: number) =>
        `${action} ${feePercent}% Node Operator fee` as const,
      confirmExpiry: (action: ConfirmAction, expiryHours: number) =>
        `${action} ${expiryHours} hours Confirmation Lifetime` as const,
      confirmSelectedTier: (tierId: string, tierMintingLimit: string) =>
        `You’re requesting to move stVault to Tier ${tierId} with a ${tierMintingLimit} minting limit.` as const,
      requestUpdateVaultShareLimitTitle:
        `Requesting new minting limit` as const,
      requestUpdateVaultShareLimitDescription: (tierMintingLimit: string) =>
        `You’re requesting to change stVault minting limit with ${tierMintingLimit}` as const,
      awaitingRequestUpdateVaultShareLimit:
        `Waiting for block confirmation for your request. This may take a few moments.` as const,
      approveChangeTierMintingLimit: `Approving change minting limit` as const,
      completeChangeTierMintingLimit:
        `Request to change tier minting limit is approved.` as const,
      approveSelectedTier: (tierId: bigint, mintingLimitStETH: bigint) =>
        `Approving Tier ${tierId} change tier with ${toStethValue(mintingLimitStETH)} minting limit.` as const,
      completeChangeTier: (tierId: bigint, mintingLimitStETH: bigint) =>
        `Request for tier ${tierId} with ${toStethValue(mintingLimitStETH)} minting limit approved` as const,
      syncTier: (tierName: string) => `Applying ${tierName} updates` as const,
      completeSyncTier: (tierName: string) =>
        `Request to apply ${tierName} updates was sent` as const,
      submit: (counter: number) => {
        if (counter > 0)
          return `Submit ${counter} transaction${counter > 1 ? 's' : ''}`;
        return 'No changes';
      },
      resumeBeaconChainDeposits: 'Resume deposits to beacon chain' as const,
      pauseBeaconChainDeposits: 'Pause deposits to beacon chain' as const,
      groups: {
        deposits: 'Deposits',
        address: 'Addresses',
        settings: 'Settings',
      },
      feeRecipient: 'Setting node operator fee recipient address',
      pdgPolicy: 'Setting PDG Policy',
      fields: {
        nodeOperator: {
          title: 'Node Operator',
          hint: 'The address of the Node Operator that provides validation service for the stVault.\nNode Operator handles depositing ETH from the stVault balance to validators and exiting validators if necessary.\nIt can’t be changed after the stVault is created.',
        },
        feeRecipient: {
          title: 'Node Operator Fee Recipient',
          editLabel: 'Set new address',
          hint: 'The address of the Node Operator Fee Recipient that has opportunity to claim fees.',
        },
        pdgPolicy: {
          title: 'Predeposit Guarantee Policy',
          optionsDescription: {
            STRICT: 'deposits require the full PDG process.',
            ALLOW_PROVE:
              'allows the node operator to prove unknown validators to PDG.',
            ALLOW_DEPOSIT_AND_PROVE:
              'allows the node operator to perform unguaranteed deposits (bypassing the predeposit requirement) and prove unknown validators.',
          },
        },
        feeRate: {
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
        isDepositAllowed: {
          title: 'Allow deposits from stVault Balance to validators',
          allowed: 'Allowed',
          paused: 'Paused',
          hint: 'When deposits are paused, the node operator cannot deposit ETH from the stVault Balance to validators. Сonsolidations remain allowed.',
        },
      },
      clearChanges: 'Clear changes',
      disconnect: {
        subTitle: 'Disconnect stVault from VaultHub',
        subDescription:
          '1 ETH connection deposit can be withdrawn after disconnection the stVault from the VaultHub protocol.',
        navigation: {
          connected: 'Learn more and disconnect',
          disconnectInitiated: 'Continue disconnection',
          disconnected: 'View',
        },
      },
    },
    validators: {
      title: 'stVaults Validators overview',
      table: {
        header: {
          index: 'Index',
          pubKey: 'Public key',
          status: 'Status',
          actualBalance: 'Actual balance',
          activatedExited: 'Activated / exited',
          menu: '',
        },
        noValidatorsFound: 'No validators found',
        placeholder: {
          title: 'No validators found',
          description:
            'Once validators are running, they will be displayed here',
          errorDescription:
            'Failed to load validator data. Please try again later',
        },
        menu: {
          topUpValidator: 'Top up validator',
          withdrawToStVault: 'Withdraw to stVault',
        },
      },
      modals: {
        withdrawal: {
          title: 'Withdraw ETH from validator to stVault',
          description:
            'You can withdraw a portion of ETH (while leaving a minimum of 32 ETH on the validator balance) or the full amount from the validator. The exact time when the withdrawn ETH appears in the stVault Not-Staked Balance depends on the current Ethereum exit queue.',
          availableToWithdraw: 'Available to withdraw',
          estimatedFee: 'Estimated withdrawal fee',
          actionFull: 'Force exit validator',
          actionPartial: 'Withdraw to stVault',
          actionDisabled: 'Withdraw unavailable',
          vaultIsJail:
            'Operation is restricted. Vault is jailed. Partial Withdrawal temporary unavailable.',
          partialWarning:
            "Withdrawals are subject for the withdrawal queue, which is not yet supported by this UI. So you'll see the result of your request only when it's done.",
          fullWarning: (amount: bigint) =>
            `You are about to force-exit this validator. The entire validator's actual balance (currently ${formatBalance(amount, { adaptiveDecimals: true }).trimmed} ETH) will be withdrawn.`,
          txModal: {
            loadingText: (index: number, amount: bigint) =>
              `You are withdrawing ${formatBalance(amount, { adaptiveDecimals: true }).trimmed} ETH from the validator #${index}`,
            mainCompleteText: (index: number, amount: bigint) =>
              `${formatBalance(amount, { adaptiveDecimals: true }).trimmed} ETH has been withdrawn from the validator #${index}`,
          },
        },
        topUp: {
          title: 'Top up validator',
          description:
            'You can top-up this validator by ETH available on the stVault Balance.',
          availableToTopup: 'Available to top up',
          estimatedFee: 'Estimated withdrawal fee',
          actionActive: 'Top up validator',
          actionDisabled: 'Top up unavailable',
          validatorWithoutPDG: `Top-ups are unavailable for this validator because it has not been proven for Predeposit Guarantee. To enable top-ups in this interface, please prove the validator.`,
          depositPaused: `Top-ups are unavailable due to temporary restrictions on deposits from the stVault Balance to validators.`,
          availableBalanceLow: (amount: bigint) =>
            `Top-ups are unavailable due to low available balance ${formatBalance(amount, { adaptiveDecimals: true }).trimmed} ETH`,
          txModal: {
            loadingText: (index: number, amount: bigint) =>
              `You are topping up the validator #${index} with ${formatBalance(amount, { adaptiveDecimals: true }).trimmed} ETH`,
            mainCompleteText: (index: number, amount: bigint) =>
              `The validator #${index} has been topped up with ${formatBalance(amount, { adaptiveDecimals: true }).trimmed} ETH`,
          },
        },
      },
    },
    rebalance: {
      title: 'Rebalance',
      submit: {
        rebalance: 'Rebalance',
        supplyAndRebalance: 'Supply and Rebalance',
        forceRebalance: 'Force rebalance',
        unavailable: 'Rebalance unavailable',
        tooltips: {
          zeroLiability:
            'Rebalance is unavailable because stETH Liability is currently zero.',
          disconnected:
            'Rebalance is unavailable because stVault is disconnected from VaultHub.',
          pendingConnect:
            'Rebalance is unavailable because stVault is pending connection to VaultHub.',
          pendingDisconnect:
            'Rebalance is unavailable because stVault is pending disconnect from VaultHub.',
          allEthStaked:
            'Rebalance is unavailable because all ETH is staked on validators, and Not Staked stVaults Balance is currently zero. To enable rebalance,',
          forceInsufficientFunds:
            'Forced rebalance is unavailable because the Not Staked stVaults Balance is not enough to cover the shortfall.',
        },
      },
      description: {
        rebalance: {
          title: 'Rebalance',
          text: 'Rebalancing sends ETH from the stVault balance to Lido Core, receives stETH at a 1:1 ratio, and repays the received stETH to the stVault. This reduces both Total Value and stETH Liability. To adjust the collateralization balance, you can also',
          supplyLinkText: 'supply ETH',
          withdrawLinkText: 'withdraw ETH from validators',
          repayLinkText: 'repay stETH',
        },
        forceRebalance: {
          title: 'Forced rebalance',
          text: 'Rebalancing sends ETH from the stVault balance to Lido Core, receives stETH at a 1:1 ratio, and repays the received stETH to the stVault. This reduces both Total Value and stETH Liability.',
          thresholdText:
            "The stVault's Forced Rebalance Threshold has been exceeded, activating the permissionless rebalancing mechanism.",
          restoreText:
            'This means the stVault can be rebalanced at any time. You can still restore the collateralization balance by',
          supplyLinkText: 'supplying ETH',
          repayLinkText: 'repaying stETH',
          noGuaranteeText:
            'However, there is no guarantee that a permissionless rebalance will not occur before your transaction is executed.',
        },
      },
      metrics: {
        title: 'stVault metrics',
        utilizationRatio: 'Utilization ratio',
        liability: 'stETH Liability',
        healthFactor: 'Health factor',
        totalValue: 'Total Value',
      },
      healthState: {
        stethLiability: 'stETH Liability',
        healthFactor: 'Health factor',
        utilizationRatio: 'Utilization ratio',
        capacityExceeded: 'stETH minting capacity exceeded',
        thresholdExceeded: 'Forced Rebalance Threshold exceeded',
      },
      supply: {
        toggle: 'Supply ETH',
        description:
          'You can supply ETH into the stVault in the same transaction as rebalance, to reduce gas expenses.',
        available: 'Available to supply',
      },
      input: {
        available: 'Available to rebalance',
        reduceToCapacity: 'Use recommended',
        forceRebalanceTooltip:
          'In the current mode, the amount of ETH subject to rebalancing is calculated automatically and cannot be changed.',
        rebalanceOversupplyWarning:
          'Supplying ETH will fully restore Utilization Ratio.',
        rebalanceOversupplyWarningLink: 'Consider supplying ETH only.',
        rebalanceRecommendedExplainer: (canReduceToCapacity: boolean) =>
          `“Use Recommended” restores the Utilization Ratio ${canReduceToCapacity ? 'to 100%' : 'as close to 100% as possible'}, based on the ETH available in the stVault Balance`,
      },
    },
    additionalVerification: {
      banners: {
        notOwner: {
          title: 'This stVault is not owned by you',
        },
        multipleOwners: {
          title: 'Multiple Vault Owners',
          description:
            'The Vault Owner role (DEFAULT_ADMIN_ROLE) is assigned to one or more additional addresses.',
          ownersListTitle: 'Other Vault Owner addresses:',
          explanation: {
            title: 'This means:',
            list: [
              'Another Vault Owner can fully control the tokens you supply.',
              'Another Vault Owner can revoke this role from your address at any time. If this happens, you will lose control over your supplied tokens.',
            ],
          },
          confirm:
            'I confirm that I understand the implications and risks and want to proceed.',
        },
      },
      settings: {
        notPassedIdentification:
          'Operator has not passed the identification process.',
      },
    },
  },
  // configuration for vault metrics as seen in overview page
  // but can be used in other places as well where vault status is displayed
  metrics: {
    pendingDisconnect: {
      title: 'Pending disconnect from Lido Core',
      description: {
        reportIsAvailable:
          'Lido Core disconnection has been initiated. To complete the process, apply the latest Oracle report. Once applied, the connection deposit will be unlocked and can be withdrawn from the stVault balance.',
        reportIsNotAvailable:
          'Lido Core disconnection has been initiated. Oracle report submission is currently unavailable. Please wait for the next reporting window. Once applied, the connection deposit will be unlocked and can be withdrawn from the stVault balance.',
      },
      actions: {
        applyReport: 'Apply the latest Oracle report',
      },
    },
    capacityExceeded: {
      title: 'stETH minting capacity exceeded',
      description:
        "The stVault's stETH minting capacity has been exceeded, indicating an imbalanced minted stETH Liability as constrained by the stVault's Reserve Ratio. You are strongly recommended to take one of the following actions:",
      note: 'Note: Rebalance allows Supply ETH and Repay stETH in one batch transaction',
      actions: {
        supply: {
          title: 'Increase Total Value',
          children: 'Supply',
        },
        repay: {
          title: 'Decrease stETH Liability',
          children: 'Repay',
        },
        learnMore: {
          title: 'Decrease Total Value and stETH Liability',
          children: 'Learn how to rebalance',
        },
        rebalance: {
          title: 'Decrease Total Value and stETH Liability',
          children: 'Rebalance',
        },
      },
    },
    thresholdExceeded: {
      title: 'Forced rebalance threshold exceeded',
      description:
        'The stVault’s Forced Rebalance Threshold has been exceeded, activating the permissionless rebalancing mechanism. This means the stVault can be rebalanced at any moment. You can still restore the Health Factor by taking one of the actions below. However, there’s no guarantee that a permissionless rebalance won’t occur before your transaction is executed.',
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
      feeRate: 'Node operator fee',
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
    reserveRatio: {
      title: 'Reserve ratio',
      hint: 'Defines amount of ETH that will be reserved as a part of collateral when the vault owner mints stETH in the vault.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    withdrawableEther: {
      title: 'Available for Immediate Withdrawal',
      hint: 'The amount of ETH that is available to withdraw from the vault balance. Constrained by the total locked ETH on the vault and the amount of ETH deposited on validators.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    healthFactorNumber: {
      title: 'Health factor',
      hint: 'The Health Factor demonstrates the economic state of the stVault. It shows how the stETH Liability is backed by the Total Value.\nThe Health Factor value equal to 100% is defined by the Forced Rebalance Threshold meaning that on the Health Factor falling under 100% the vault becomes subject to forced rebalancing.',
      description:
        'The Health Factor demonstrates the economic state of the stVault. It shows how the stETH Liability is backed by the Total Value.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    vaultLiabilityStETH: {
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
    feeRate: {
      title: 'Node Operator daily fee',
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
      hint: 'The amount of accumulated but not yet settled Lido fees. This amount of ETH increases the amount of total locked ETH.\n\nLido fees consist of the following components and are calculated daily.',
      learnMoreLink: '', // TODO: add learnMoreLink to the each property after doc will be ready
    },
    netApr: {
      title: 'Net staking APR',
      hint: 'Estimated yearly returns from staking in the vault, after fees deductions, but without considering stETH Liability growth due to stETH rebase. This percentage reflects moving average of APR for the past 7 day period. This percentage does not guarantee future performance and is subject to change.',
      description:
        'Estimated yearly return after fees, excluding stETH liability growth from rebasing. Based on the 7-day moving average APR. Past performance doesn’t guarantee future results.',
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
            'Estimated yearly returns from staking in the vault, after deductions of fees and stETH Liability growth due to stETH rebase. Averaged over the past 7 days.',
        },
        bottomLine: {
          title: 'stVault Daily Bottom Line',
          description:
            'The final amount of rewards earned by the vault owner within the stVault, considering the stETH Liability grow driven by stETH rebasing. Calculated as the difference between Net Staking Rewards and stETH Liability growth.',
        },
        netStakingRewards: {
          title: 'Net daily staking rewards',
          description:
            'The amount of staking rewards remain after deductions of Node Operator Fee and Lido fees.',
        },
        stethRebase: {
          title: 'stETH Daily Rebase',
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
          title: 'Net daily staking rewards',
          description:
            'The amount of staking rewards remain after deductions of Node Operator Fee and Lido fees.',
        },
        grossStakingRewards: {
          title: 'Gross daily staking rewards',
          description:
            'The amount of rewards earned by the validators expressed as a percentage of the vault total value, before fees deductions.',
        },
        noFee: {
          title: 'Node Operator daily fee',
          description:
            'The share of Gross staking rewards that the Node Operator charges for provided validation service.',
        },
        lidoFees: {
          title: 'Lido daily fees',
          description:
            'The amount of accumulated but not yet claimed Lido fees. This amount of ETH increases the amount of total locked ETH.',
        },
      },
      vaultLiability: {
        utilizationRatio: {
          title: 'Utilization Ratio',
          description:
            'The share of the stETH minting capacity currently utilized by the vault owner.',
        },
        totalStethMintingCapacity: {
          title: 'Total stETH minting capacity',
          constrainedBy: (
            constraintBy:
              | 'minimalReserve'
              | 'reserveRatio'
              | 'vault'
              | 'lido'
              | 'tier'
              | 'group',
          ) => {
            switch (constraintBy) {
              case 'minimalReserve':
                return 'constrained by Minimal Reserve';
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
          description: (
            minimalReserve: bigint | undefined,
            constraintBy:
              | 'minimalReserve'
              | 'reserveRatio'
              | 'vault'
              | 'lido'
              | 'tier'
              | 'group'
              | undefined,
          ) => {
            const baseDescription =
              'The amount of stETH the Vault Owner can mint within the Reserve Ratio boundaries. Also limited by the stETH minting limit.';
            const minimalReserveText =
              'Reserve is defined by the Minimal Reserve value of 1 ETH for the connection to Lido Core.';
            if (
              constraintBy === 'minimalReserve' &&
              minimalReserve === ONE_ETHER
            ) {
              return `${baseDescription} ${minimalReserveText}`;
            }

            return baseDescription;
          },
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
    banners: {
      outdatedMetrics: {
        title: (date: string) =>
          `Validator Balance Spike Detected — Metrics as of ${date}`,
        description: (date: string) =>
          `A balance spike was detected on one or more validators, likely caused
        by a side deposit or consolidation event. Due to current UI
        limitations, today's metrics — Rewards, APR, Carry Spread, and
        others — cannot be calculated accurately for this day. Data shown
        reflects the last valid snapshot: ${date}.`,
      },
    },
  },
  // configuration for vault roles
  roles: {
    defaultAdmin: {
      title: 'Vault Manager',
      buttonText: 'Vault Manager',
      hint: 'One of two admin roles for the stVault. Allows to manage permissions and change key Vault parameters.\nVault Manager role can be considered as Vault Owner for the User.\nMultiple addresses supported.',
    },
    nodeOperatorManager: {
      title: 'Node Operator Manager',
      buttonText: 'Node Operator Manager',
      hint: 'One of two admin roles for the stVault. Allows to manage permissions and change key Vault parameters from the Node Operator perspective.\nMultiple addresses supported',
    },
    supplier: {
      title: 'Supply (fund) ETH to the stVault',
      buttonText: 'Supply (fund) ETH to the stVault',
      hint: 'Allows Supplying ETH',
    },
    withdrawer: {
      title: 'Withdraw ETH from the stVault Balance',
      buttonText: 'Withdraw ETH from the stVault Balance',
      hint: 'Allows Withdrawing unlocked ETH from stVault',
    },
    depositsPauser: {
      title: 'Pause Deposits to Validators',
      buttonText: 'Pause Deposits to Validators',
      hint: 'Allows requesting the Node Operator to pause deposits to Validators to keep available ETH on the Vault balance.',
    },
    depositsResumer: {
      title: 'Resume Deposits to Validators',
      buttonText: 'Resume Deposits to Validators',
      hint: 'Allows informing the Node Operator that deposits to Validators can be resumed.',
    },
    validatorWithdrawalTrigger: {
      title: 'Force Withdrawals of ETH from Validator',
      buttonText: 'Force Withdrawals of ETH from Validator',
      hint: 'Allows forced withdrawing ETH from validator and returning it to Vault balance.',
    },
    validatorExitRequester: {
      title: 'Request Node Operator to Exit Validator',
      buttonText: 'Request Node Operator to Exit Validator',
      hint: 'Allows creating a request for Node Operator to exit a validator and return all ETH from this validator to the Vault balance.',
    },
    rebalancer: {
      title: 'Re-balance unhealthy Vault',
      buttonText: 'Rebalance Vault',
      // TODO: link support
      hint: 'Allows rebalancing stVault if Health rate < 100%',
    },
    minter: {
      title: 'Mint stETH',
      buttonText: 'Mint stETH',
      hint: 'Allows Minting stETH (considering ReserveRatio)',
    },
    repayer: {
      title: 'Repay (burn) previously minted stETH to decrease stETH Liability',
      buttonText:
        'Repay (burn) previously minted stETH to decrease stETH Liability',
      hint: 'Allows Repaying stETH',
    },
    volunataryDisconnecter: {
      title: 'Voluntary disconnect Vault from Lido Vault Hub',
      buttonText: 'Voluntary disconnect Vault from Lido Vault Hub',
      hint: 'Allows voluntary disconnecting stVault from the Lido Vault Hub.',
    },
    vaultConfiguration: {
      title: 'Request to change the stVault tier',
      buttonText: 'Request to change the stVault tier',
      hint: 'Allows requesting Node Operator to change the stVaults tier',
    },
    assetCollector: {
      title: 'Assets Collector',
      buttonText: 'Assets Collector',
      hint: 'ERC20 Assets Collector', // TODO: add description
    },
    nodeOperatorFeeClaimer: {
      title: 'Claim Node Operator’s Accumulated Fees',
      buttonText: 'Claim Node Operator’s Accumulated Fees',
      hint: 'Allows claiming accumulated Node Operator’s fee.\nClaimer provides an address to receive fees.',
    },
    feeExemptRole: {
      title: `Node operator's sub-role for fee exemptions`,
      buttonText: `Node operator's sub-role for fee exemptions`,
      hint: `Any ETH appearing on validators outside of stVaults mechanisms (e.g. side deposits or consolidations) is treated as rewards, and the Node Operator Fee applies. To classify ETH as a deposit instead, the Node Operator can adjust the validator balance accordingly.`,
    },
    unguaranteedDepositRole: {
      title: `Node operator's sub-role for unguaranteed deposit`,
      buttonText: `Node operator's sub-role for unguaranteed deposit`,
      hint: `If PDG Policy is set to ALLOW_DEPOSIT_AND_PROVE, the Node Operator can assign address that will perform unguaranteed deposits to validators.`,
    },
    proveUnknownValidatorsRole: {
      title: `Node operator's sub-role for proving unknown validators`,
      buttonText: `Node operator's sub-role for proving unknown validators`,
      hint: `If PDG Policy is set to ALLOW_PROVE or ALLOW_DEPOSIT_AND_PROVE, the Node Operator can assign address that will prove unknown validators to PDG.`,
    },
    guarantor: {
      title: 'Guarantor',
      buttonText: 'Guarantor',
      hint: 'Manages the Node Operator’s guarantor bond: top up, withdraw, and claim refunds.',
    },
    depositor: {
      title: 'Depositor',
      buttonText: 'Depositor',
      hint: 'Pre-deposit and deposit validators to the Beacon Chain.',
    },
  },
  // common texts like errors, warnings, etc.
  common: {
    warnings: {
      balanceWarning:
        'Using most of ETH balance may result in insufficient funds for gas fees',
    },
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
      pubkey: {
        required: 'Validator public key is required',
        invalid: 'Invalid validator public key',
      },

      tx: {
        getStatus:
          'Could not locate transaction status but your transcation could still be sent. Please check your wallet for details.',
        getStatusTitle: 'Transaction Status Unavailable',
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
    pageTitle: '| stVaults | Lido',
  },
} as const;
