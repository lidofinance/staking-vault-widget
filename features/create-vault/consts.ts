import { MainSettingsEntryType } from './types';

export enum CREATE_VAULT_FORM_STEPS {
  main = 1,
  confirm,
}

const steps = ['Main settings', 'Verify new vaults settings'];

export const getSectionNameByStep = (step: number) => steps[step - 1];

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
];
