import { InputProps } from '@lidofinance/lido-ui';
import { FieldConfig, FieldName } from 'features/create-vault/types';

export const CREATE_VAULT_STEPS = 3;

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
    label: 'by address-field',
  },
];

export type ToggleValue =
  (typeof PermissionToggleEnum)[keyof typeof PermissionToggleEnum];

export const steps: Record<number, string> = {
  '1': 'Main settings',
  '2': 'Permissions',
  '3': 'Confirmation',
};

export const getSectionNameByStep = (step: number) => steps[step];

export const createVaultFieldsList: FieldConfig<FieldName>[] = [
  {
    name: 'nodeOperator',
    title: 'Node Operator',
    label: 'Node Operator address-field',
    notes:
      'Node Operator address-field cannot be changed after the vault is created',
    dataType: 'address',
  },
  {
    name: 'assetRecoverer',
    title: 'Asset Recoverer',
    label: 'Asset Recoverer address-field',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorFeeBP',
    title: 'Node Operator fee',
    label: 'Node Operator fee, %',
    dataType: 'percent',
    type: 'number' as InputProps['type'],
  },
  {
    name: 'curatorFeeBP',
    title: 'Curator fee',
    label: 'Curator fee, %',
    dataType: 'percent',
    type: 'number' as InputProps['type'],
  },
  {
    name: 'confirmExpiry',
    title: 'Confirmation Lifetime',
    label: 'Confirmation Lifetime, hours',
    afterText: 'hours',
    dataType: 'time',
    type: 'number' as InputProps['type'],
  },
  {
    name: 'defaultAdmin',
    title: 'Vault Manager',
    label: 'Vault Manager address-field or ENS',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorManager', // TODO: remove
    title: 'Node Operator Manager',
    label: 'Node Operator Manager address-field or ENS',
    dataType: 'address',
  },
  {
    name: 'curatorFeeSetters',
    title: 'Set Vault Curator’s fee',
    dataType: 'address',
  },
  {
    name: 'curatorFeeClaimers',
    title: 'ClaimPage Vault Curator’s fee (address-field)',
    dataType: 'address',
  },
  {
    name: 'withdrawers',
    title: 'Withdrawers',
    dataType: 'address',
  },
  {
    name: 'funders',
    title: 'Funders',
    dataType: 'address',
  },
  {
    name: 'minters',
    title: 'Minters',
    dataType: 'address',
  },
  {
    name: 'burners',
    title: 'Burners',
    dataType: 'address',
  },
  {
    name: 'rebalancers',
    title: 'Rebalancers',
    dataType: 'address',
  },
  {
    name: 'depositPausers',
    title: 'Pause Deposits to beacon chain (all amount)',
    dataType: 'address',
  },
  {
    name: 'depositResumers',
    title: 'Resume Deposits to beacon chain (all amount)',
    dataType: 'address',
  },
  {
    name: 'validatorExitRequesters',
    title: 'Initiate validator exit procedure (address-field)',
    dataType: 'address',
  },
  {
    name: 'validatorWithdrawalTriggerers',
    title:
      'Force NodeOperator to repay funds from validator(s) (public key, sum)',
    dataType: 'address',
  },
  {
    name: 'disconnecters',
    title: 'Disconnecters',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorFeeClaimers',
    title: 'ClaimPage NOs fees from the vault (ETH) (address-field)',
    dataType: 'address',
  },
];

export const mainSettingsFields = [
  'nodeOperator',
  'assetRecoverer',
  'nodeOperatorFeeBP',
  'curatorFeeBP',
  'confirmExpiry',
  'defaultAdmin',
  'nodeOperatorManager',
] as const;

export const getCreateVaultFields = <T extends FieldName>(
  fieldsList: readonly T[],
): FieldConfig<T>[] => {
  return createVaultFieldsList.filter((field): field is FieldConfig<T> =>
    fieldsList.includes(field.name as T),
  );
};
