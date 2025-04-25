import { z } from 'zod';
import { isValidAnyAddress } from 'utils/address-validation';

import { PermissionsRoles } from './types';
import { Address } from 'viem';

export enum PermissionToggleEnum {
  byPermission = 'by_permission',
  byAddress = 'by_address',
}

export enum SubmitPermissionsStepEnum {
  edit = 'edit',
  initiate = 'initiate',
  confirming = 'confirming',
  reject = 'reject',
  error = 'error',
  submitting = 'submitting',
  success = 'success',
}

export const permissionsToggleList = [
  {
    value: PermissionToggleEnum.byPermission,
    label: 'by Permission',
  },
  {
    value: PermissionToggleEnum.byAddress,
    label: 'by address',
  },
];

export type ToggleValue =
  (typeof PermissionToggleEnum)[keyof typeof PermissionToggleEnum];

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const validateAddress = (value: string) => isValidAnyAddress(value);
const accountSchema = z
  .string()
  .refine(validateAddress, { message: INVALID_ADDRESS_MESSAGE })
  .transform((value) => value as Address);

const addressSchema = z.discriminatedUnion('group', [
  z.object({
    group: z.literal('eventual'),
    state: z.union([z.literal('restore'), z.literal('grant')]),
    account: accountSchema,
  }),
  z.object({
    group: z.literal('settled'),
    state: z.union([z.literal('remove'), z.literal('display')]),
    account: accountSchema,
  }),
]);

export const editPermissionsSchema = z.object({
  FUND_ROLE: z.array(addressSchema).optional(),
  WITHDRAW_ROLE: z.array(addressSchema).optional(),
  LOCK_ROLE: z.array(addressSchema).optional(),
  MINT_ROLE: z.array(addressSchema).optional(),
  BURN_ROLE: z.array(addressSchema).optional(),
  REBALANCE_ROLE: z.array(addressSchema).optional(),
  PAUSE_BEACON_CHAIN_DEPOSITS_ROLE: z.array(addressSchema).optional(),
  RESUME_BEACON_CHAIN_DEPOSITS_ROLE: z.array(addressSchema).optional(),
  REQUEST_VALIDATOR_EXIT_ROLE: z.array(addressSchema).optional(),
  TRIGGER_VALIDATOR_WITHDRAWAL_ROLE: z.array(addressSchema).optional(),
  VOLUNTARY_DISCONNECT_ROLE: z.array(addressSchema).optional(),
  RECOVER_ASSETS_ROLE: z.array(addressSchema).optional(),
  NODE_OPERATOR_FEE_CLAIM_ROLE: z.array(addressSchema).optional(),
  NODE_OPERATOR_REWARDS_ADJUST_ROLE: z.array(addressSchema).optional(),
  PDG_COMPENSATE_PREDEPOSIT_ROLE: z.array(addressSchema).optional(),
  PDG_PROVE_VALIDATOR_ROLE: z.array(addressSchema).optional(),
  UNGUARANTEED_BEACON_CHAIN_DEPOSIT_ROLE: z.array(addressSchema).optional(),
  LIDO_VAULTHUB_DEAUTHORIZATION_ROLE: z.array(addressSchema).optional(),
  LIDO_VAULTHUB_AUTHORIZATION_ROLE: z.array(addressSchema).optional(),
  OSSIFY_ROLE: z.array(addressSchema).optional(),
  SET_DEPOSITOR_ROLE: z.array(addressSchema).optional(),
  RESET_LOCKED_ROLE: z.array(addressSchema).optional(),
  REQUEST_TIER_CHANGE_ROLE: z.array(addressSchema).optional(),
});

export const adminPermissionsList: PermissionsRoles[] = [
  {
    role: 'FUND_ROLE',
    title: 'Supply ETH',
    tooltip: 'Allows Supplying ETH',
  },
  {
    role: 'WITHDRAW_ROLE',
    title: 'Withdraw ETH',
    tooltip: 'Allows Withdrawing unlocked ETH from stVault',
  },
  {
    role: 'PAUSE_BEACON_CHAIN_DEPOSITS_ROLE',
    title: 'Pause Deposits to Validators',
    tooltip:
      'Allows requesting the Node Operator to pause deposits to Validators to keep available ETH on the Vault balance.',
  },
  {
    role: 'RESUME_BEACON_CHAIN_DEPOSITS_ROLE',
    title: 'Resume Deposits to Validators',
    tooltip:
      'Allows informing the Node Operator that deposits to Validators can be resumed.',
  },
  {
    role: 'TRIGGER_VALIDATOR_WITHDRAWAL_ROLE',
    title: 'Force Withdrawals ETH from Validator',
    tooltip:
      'Allows forced withdrawing ETH from validator and returning it to Vault balance.',
  },
  {
    role: 'REQUEST_VALIDATOR_EXIT_ROLE',
    title: 'Request Node Operator to Exit Validator',
    tooltip:
      'Allows creating a request for Node Operator to exit a validator and return all ETH from this validator to the Vault balance.',
  },
  {
    role: 'REBALANCE_ROLE',
    title: 'Re-balance unhealthy Vault',
    tooltip: 'Allows rebalancing stVault if Health rate < 100%.',
  },
  {
    role: 'MINT_ROLE',
    title: 'Mint stETH',
    tooltip: 'Allows Minting stETH (considering ReserveRatio)',
  },
  {
    role: 'BURN_ROLE',
    title: 'Repay stETH',
    tooltip: 'Allows Repaying stETH',
  },
  {
    role: 'VOLUNTARY_DISCONNECT_ROLE',
    title: 'Voluntary disconnect Vault from Lido Vault Hub',
    tooltip: 'Allows voluntary disconnecting stVault from the Lido Vault Hub.',
  },
  {
    role: 'LOCK_ROLE',
    title: 'Lock eth on vault',
    tooltip: 'Allows to lock eth on vault',
  },
  {
    role: 'RECOVER_ASSETS_ROLE',
    title: 'Withdraw tokens wrongly transferred to the Dashboard contract.',
    tooltip:
      'Transfer tokens away that were wrongly transferred to the Dashboard contract.',
  },
  {
    role: 'PDG_COMPENSATE_PREDEPOSIT_ROLE',
    title: 'Compensate 1 ETH for disproven validator.',
    tooltip:
      'In a case of disproven pre-deposit on validator, transfer unlocked 1 ETH from PDG bond to the specified address.',
  },
  {
    role: 'PDG_PROVE_VALIDATOR_ROLE',
    title: 'Prove the validator to PDG',
    tooltip:
      'If validator exists on the Beacon Chain, user can prove this validator to PDG.',
  },
  {
    role: 'UNGUARANTEED_BEACON_CHAIN_DEPOSIT_ROLE',
    title: 'Unguaranteed deposit to validators',
    tooltip:
      'Direct and unguaranteed deposit ETH from the vault balance to validators. This deposit is performed outside Pre-Deposit Guarantee contract so the operation is vulnerable.',
  },
  {
    role: 'LIDO_VAULTHUB_DEAUTHORIZATION_ROLE',
    title: 'De-authorize for connection to Lido Vault Hub.',
    tooltip: 'De-authorize the stVault to be connected to the Lido Vault Hub.',
  },
  {
    role: 'LIDO_VAULTHUB_AUTHORIZATION_ROLE',
    title: 'Authorize for connection to Lido Vault Hub.',
    tooltip: 'Authorize the stVault to be connected to the Lido Vault Hub.',
  },
  {
    role: 'OSSIFY_ROLE',
    title:
      'Ossify the stVault: irreversible forbid connection to the Lido Vault Hub.',
    tooltip:
      'Permission for ossifying the stVault: irreversible forbid to be connected to the Lido Vault Hub.',
  },
  {
    role: 'SET_DEPOSITOR_ROLE',
    title:
      'Set depositor for the stVault disconnected from the Lido Vault Hub.',
    tooltip:
      'Set depositor for the stVault disconnected from the Lido Vault Hub.',
  },
  {
    role: 'RESET_LOCKED_ROLE',
    title: 'Reset locked amount of ETH on the disconnected stVault',
    tooltip:
      'Permission for resetting locked amount on the disconnected stVault.',
  },
  {
    role: 'REQUEST_TIER_CHANGE_ROLE',
    title: 'Request to change the stVault tier',
    tooltip: 'Allows requesting Node Operator to change the stVaults tier.',
  },
];

export const noPermissionsList: PermissionsRoles[] = [
  {
    role: 'NODE_OPERATOR_FEE_CLAIM_ROLE',
    title: 'ClaimPage Node Operator’s Accumulated Fees',
    tooltip:
      'Allows claiming accumulated Node Operator’s fee. Claimer provides an address to receive fees.',
  },
  {
    role: 'NODE_OPERATOR_REWARDS_ADJUST_ROLE',
    title: 'Adjust rewards on the validators',
    tooltip:
      'ETH added outside stVaults mechanisms is treated as rewards and subject to Node Operator Fee unless marked as deposit.',
  },
];
