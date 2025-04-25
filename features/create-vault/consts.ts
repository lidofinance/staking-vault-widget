import { MainSettingsEntryType } from './types';

export const CREATE_VAULT_STEPS = 2;

export enum PermissionToggleEnum {
  byPermission = 'by_permission',
  byAddress = 'by_address',
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

export const steps: Record<number, string> = {
  '1': 'Main settings',
  '2': 'Confirmation',
};

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
