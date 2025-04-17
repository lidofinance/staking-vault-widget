import { z } from 'zod';
import { isValidAnyAddress } from 'utils/address-validation';
import { MainSettingsOverview, TxData } from './types';
import { MAX_CONFIRM_EXPIRY, MIN_CONFIRM_EXPIRY } from 'consts/delegation';

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
const INVALID_NUMBER_MIN_MESSAGE = 'Must be 0.001 or above';
const INVALID_NUMBER_MAX_MESSAGE = 'Must be 99 or less';
const INVALID_NUMBER_EXPIRY_MIN_MESSAGE = 'Must be 24 or above';
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = 'Must be 720 or less';
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
        .min(0.001, INVALID_NUMBER_MIN_MESSAGE)
        .max(99, INVALID_NUMBER_MAX_MESSAGE),
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
  },
  {
    name: 'confirmExpiry',
    title: 'Confirmation Lifetime',
    label: 'Current Confirmation Life Time, hours',
    editLabel: 'Propose new Сonfirmation Lifetime, hours',
    dataType: 'time',
    vaultKey: 'confirmExpiry',
  },
  {
    name: 'defaultAdmin',
    title: 'Vault Manager',
    label: 'Vault Manager address or ENS',
    editLabel: 'Vault Manager address or ENS',
    dataType: 'address',
    actionText: 'Add new address',
    vaultKey: 'defaultAdmins',
  },
  {
    name: 'nodeOperatorManager',
    title: 'Node Operator Manager',
    label: 'Node Operator Manager address or ENS',
    editLabel: 'Node Operator Manager address or ENS',
    dataType: 'address',
    actionText: 'Add new address',
    vaultKey: 'nodeOperatorManagers',
  },
];

export const fnNamesMap: Record<
  keyof TxData,
  'grantRoles' | 'setConfirmExpiry' | 'setNodeOperatorFeeBP'
> = {
  roles: 'grantRoles',
  confirmExpiry: 'setConfirmExpiry',
  nodeOperatorFeeBP: 'setNodeOperatorFeeBP',
};
