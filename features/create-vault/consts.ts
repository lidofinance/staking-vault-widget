import { vaultTexts } from 'modules/vaults';
import type { MainSettingsEntryType, MainSettingsKeys } from './types';

export enum CREATE_VAULT_FORM_STEPS {
  addresses = 1,
  settings,
  confirm,
}

const steps = vaultTexts.actions.createVault.steps;

export const SECTION_NAMES_BY_STEP = steps.reduce(
  (acc, step, index) => ({
    ...acc,
    [index + 1]: step,
  }),
  {} as Record<number, string>,
);

export const CREATE_VAULT_STEPS = steps.length;

const texts = vaultTexts.actions.createVault.fields;

const NODE_OPERATOR: MainSettingsEntryType = {
  name: 'nodeOperator',
  dataType: 'address',
  ...texts.nodeOperator,
};

const NODE_OPERATOR_MANAGER: MainSettingsEntryType = {
  name: 'nodeOperatorManager',
  dataType: 'address',
  ...texts.nodeOperatorManager,
};

const VAULT_OWNER: MainSettingsEntryType = {
  name: 'vaultOwner',
  dataType: 'addressArray',
  ...texts.vaultOwner,
};

const FEE_RATE: MainSettingsEntryType = {
  name: 'feeRate',
  dataType: 'percent',
  type: 'number',
  ...texts.feeRate,
};

const CONFIRM_EXPIRY: MainSettingsEntryType = {
  name: 'confirmExpiry',
  dataType: 'time',
  type: 'number',
  ...texts.confirmationLifetime,
};

export const CREATE_VAULT_ADDRESSES: MainSettingsEntryType[] = [
  NODE_OPERATOR,
  NODE_OPERATOR_MANAGER,
  VAULT_OWNER,
];

export const CREATE_VAULT_SETTINGS: MainSettingsEntryType[] = [
  FEE_RATE,
  CONFIRM_EXPIRY,
];

// order of rows on verify and result screens
export const CONFIRM_ENTRIES: MainSettingsEntryType[] = [
  NODE_OPERATOR,
  FEE_RATE,
  CONFIRM_EXPIRY,
  VAULT_OWNER,
  NODE_OPERATOR_MANAGER,
];

export type FormStepWithFields =
  | CREATE_VAULT_FORM_STEPS.addresses
  | CREATE_VAULT_FORM_STEPS.settings;

// fields validated before moving to the next step
export const STEP_FIELDS: Record<FormStepWithFields, MainSettingsKeys[]> = {
  [CREATE_VAULT_FORM_STEPS.addresses]: [
    'nodeOperator',
    'nodeOperatorManager',
    'vaultOwner',
  ],
  [CREATE_VAULT_FORM_STEPS.settings]: ['feeRate', 'confirmExpiry'],
};
