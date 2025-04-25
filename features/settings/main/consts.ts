import { z } from 'zod';
import { isValidAnyAddress } from 'utils/address-validation';
import { MainSettingsOverview } from './types';
import {
  MIN_FEE_VALUE,
  MAX_FEE_VALUE,
  MAX_CONFIRM_EXPIRY,
  MIN_CONFIRM_EXPIRY,
} from 'modules/vaults';

export enum SubmittingMainFormStepsEnum {
  edit = 'edit',
  initiate = 'initiate',
  confirming = 'confirming',
  reject = 'reject',
  error = 'error',
  submitting = 'submitting',
  success = 'success',
}

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = `Must be ${MIN_FEE_VALUE} or above`;
const INVALID_NUMBER_MAX_MESSAGE = `Must be ${MAX_FEE_VALUE} or less`;
const INVALID_NUMBER_EXPIRY_MIN_MESSAGE = `Must be ${MIN_CONFIRM_EXPIRY} or above`;
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = `Must be ${MAX_CONFIRM_EXPIRY} or less`;
const INVALID_NUMBER_DATA_OBJECT_MESSAGE = { message: 'Only number is valid' };

const addressSchema = z
  .string()
  .refine(isValidAnyAddress, { message: INVALID_ADDRESS_MESSAGE });

export const editMainSettingsSchema = z.object({
  nodeOperatorManager: z.array(z.object({ value: addressSchema })),
  nodeOperatorFeeBP: z.array(
    z.object({
      value: z.coerce
        .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
        .min(MIN_FEE_VALUE, INVALID_NUMBER_MIN_MESSAGE)
        .max(MAX_FEE_VALUE, INVALID_NUMBER_MAX_MESSAGE),
    }),
  ),
  confirmExpiry: z.array(
    z.object({
      value: z.coerce
        .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
        .min(MIN_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MIN_MESSAGE)
        .max(MAX_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MAX_MESSAGE),
    }),
  ),
  defaultAdmin: z.array(z.object({ value: addressSchema })),
});

export const fieldsForRender: MainSettingsOverview[] = [
  {
    name: 'nodeOperatorFeeBP',
    title: 'Node Operator fee',
    label: 'Current Node Operator fee, %',
    editLabel: 'Propose new Node Operator fee, %',
    dataType: 'percent',
    vaultKey: 'nodeOperatorFeeBP',
    canEditRole: 'confirmingRoles',
  },
  {
    name: 'confirmExpiry',
    title: 'Confirmation Lifetime',
    label: 'Current Confirmation Life Time, hours',
    editLabel: 'Propose new Сonfirmation Lifetime, hours',
    dataType: 'time',
    vaultKey: 'confirmExpiry',
    canEditRole: 'confirmingRoles',
  },
  {
    name: 'defaultAdmin',
    title: 'Vault Manager',
    label: 'Vault Manager address or ENS',
    editLabel: 'Vault Manager address or ENS',
    dataType: 'address',
    actionText: 'Add new address',
    vaultKey: 'defaultAdmins',
    canEditRole: 'defaultAdmin',
  },
  {
    name: 'nodeOperatorManager',
    title: 'Node Operator Manager',
    label: 'Node Operator Manager address or ENS',
    editLabel: 'Node Operator Manager address or ENS',
    dataType: 'address',
    actionText: 'Add new address',
    vaultKey: 'nodeOperatorManagers',
    canEditRole: 'nodeOperatorManager',
  },
];
