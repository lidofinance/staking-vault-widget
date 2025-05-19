import { MainSettingsEntryType } from './types';

export enum CREATE_VAULT_FORM_STEPS {
  main = 1,
  confirm,
}

const steps = ['Main settings', 'Verify new vault’s settings'];

export const SECTION_NAMES_BY_STEP = steps.reduce(
  (acc, step, index) => ({
    ...acc,
    [index + 1]: step,
  }),
  {} as Record<number, string>,
);

export const CREATE_VAULT_STEPS = steps.length;

export const MAIN_SETTINGS: MainSettingsEntryType[] = [
  {
    name: 'nodeOperator',
    title: 'Node Operator',
    label: 'Node Operator address',
    notes: 'Node Operator address cannot be changed after the vault is created',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorFeeBP',
    title: 'Node Operator fee',
    label: 'Node Operator fee, %',
    dataType: 'percent',
    type: 'number',
  },
  {
    name: 'confirmExpiry',
    title: 'Confirmation Lifetime',
    label: 'Confirmation Lifetime, hours',
    dataType: 'time',
    type: 'number',
  },
  {
    name: 'vaultManager',
    title: 'Vault Manager',
    label: 'Vault Manager address',
    dataType: 'addressArray',
  },
  {
    name: 'nodeOperatorManager',
    title: 'Node Operator Manager',
    label: 'Node Operator Manager address',
    dataType: 'address',
  },
  {
    name: 'acceptTerms',
    notes: 'Vault creation requires a supply of 1 ETH.',
    dataType: 'confirm',
  },
];
