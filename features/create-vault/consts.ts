import { MainSettingsEntryType } from './types';

export const CREATE_VAULT_STEPS = 2;

export const steps = ['Main settings', 'Confirmation'];

export const getSectionNameByStep = (step: number) => steps[step];

export const mainSettingsFields = [
  'defaultAdmin',
  'nodeOperator',
  'nodeOperatorFeeBP',
  'confirmExpiry',
  'nodeOperatorManager',
] as const;

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
    afterText: 'hours',
    dataType: 'time',
    type: 'number',
  },
  {
    name: 'defaultAdmin',
    title: 'Vault Manager',
    label: 'Vault Manager address or ENS',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorManager',
    title: 'Node Operator Manager',
    label: 'Node Operator Manager address or ENS',
    dataType: 'address',
  },
];

export enum CREATE_VAULT_FORM_STEPS {
  main,
  confirm,
  permissions,
}
