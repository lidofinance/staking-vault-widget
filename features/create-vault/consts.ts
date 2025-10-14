import { vaultTexts } from 'modules/vaults';
import { MainSettingsEntryType } from './types';

export enum CREATE_VAULT_FORM_STEPS {
  main = 1,
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

export const MAIN_SETTINGS: MainSettingsEntryType[] = [
  {
    name: 'nodeOperator',
    dataType: 'address',
    ...texts.nodeOperator,
  },
  {
    name: 'feeRate',
    dataType: 'percent',
    type: 'number',
    ...texts.feeRate,
  },
  {
    name: 'confirmExpiry',
    dataType: 'time',
    type: 'number',
    ...texts.confirmationLifetime,
  },
  {
    name: 'vaultOwner',
    dataType: 'addressArray',
    ...texts.vaultOwner,
  },
  {
    name: 'nodeOperatorManager',
    dataType: 'address',
    ...texts.nodeOperatorManager,
  },
  {
    name: 'acceptTerms',
    dataType: 'confirm',
    ...texts.acceptTerms,
  },
];

export const CREATE_VAULT_ADDRESSES: MainSettingsEntryType[] = [
  {
    name: 'nodeOperator',
    dataType: 'address',
    ...texts.nodeOperator,
  },
  {
    name: 'nodeOperatorManager',
    dataType: 'address',
    ...texts.nodeOperatorManager,
  },
  {
    name: 'vaultOwner',
    dataType: 'addressArray',
    ...texts.vaultOwner,
  },
];

export const CREATE_VAULT_SETTINGS: MainSettingsEntryType[] = [
  {
    name: 'feeRate',
    dataType: 'percent',
    type: 'number',
    ...texts.feeRate,
  },
  {
    name: 'confirmExpiry',
    dataType: 'time',
    type: 'number',
    ...texts.confirmationLifetime,
  },
];
