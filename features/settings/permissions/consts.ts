import { z } from 'zod';
import { isValidAnyAddress } from 'utils/address-validation';
import { EDITABLE_PERMISSIONS } from 'consts/roles';
import { Address } from 'viem';
import { PermissionsRoles } from './types';

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
    label: 'by address-field',
  },
];

export type ToggleValue =
  (typeof PermissionToggleEnum)[keyof typeof PermissionToggleEnum];

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address-field';
const validateAddress = (value: string) => isValidAnyAddress(value);
const addressSchema = z
  .string()
  .refine(validateAddress, { message: INVALID_ADDRESS_MESSAGE });

export const editPermissionsSchema = z.object({
  FUND_ROLE: z.array(addressSchema).optional(),
  WITHDRAW_ROLE: z.array(addressSchema).optional(),
  MINT_ROLE: z.array(addressSchema).optional(),
  BURN_ROLE: z.array(addressSchema).optional(),
  REBALANCE_ROLE: z.array(addressSchema).optional(),
  PAUSE_BEACON_CHAIN_DEPOSITS_ROLE: z.array(addressSchema).optional(),
  RESUME_BEACON_CHAIN_DEPOSITS_ROLE: z.array(addressSchema).optional(),
  REQUEST_VALIDATOR_EXIT_ROLE: z.array(addressSchema).optional(),
  TRIGGER_VALIDATOR_WITHDRAWAL_ROLE: z.array(addressSchema).optional(),
  VOLUNTARY_DISCONNECT_ROLE: z.array(addressSchema).optional(),
  NODE_OPERATOR_FEE_CLAIM_ROLE: z.array(addressSchema).optional(),
  LOCK_ROLE: z.array(addressSchema).optional(),
});

export const defaultPermissionsValues: Record<EDITABLE_PERMISSIONS, Address[]> =
  {
    FUND_ROLE: [],
    WITHDRAW_ROLE: [],
    MINT_ROLE: [],
    BURN_ROLE: [],
    REBALANCE_ROLE: [],
    PAUSE_BEACON_CHAIN_DEPOSITS_ROLE: [],
    RESUME_BEACON_CHAIN_DEPOSITS_ROLE: [],
    REQUEST_VALIDATOR_EXIT_ROLE: [],
    TRIGGER_VALIDATOR_WITHDRAWAL_ROLE: [],
    VOLUNTARY_DISCONNECT_ROLE: [],
    NODE_OPERATOR_FEE_CLAIM_ROLE: [],
    LOCK_ROLE: [],
  };

export const adminPermissionsList: PermissionsRoles[] = [
  {
    role: 'FUND_ROLE',
    title: 'Mint ETH',
    tooltip: 'Allows Funding ETH',
  },
  {
    role: 'WITHDRAW_ROLE',
    title: 'Repay ETH',
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
    title: 'Burn stETH',
    tooltip: 'Allows Burning stETH',
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
];

export const noPermissionsList: PermissionsRoles[] = [
  {
    role: 'NODE_OPERATOR_FEE_CLAIM_ROLE',
    title: 'ClaimPage Node Operator’s Accumulated Fees',
    tooltip:
      'Allows claiming accumulated Node Operator’s fee. Claimer provides an address-field to receive fees.',
  },
];
