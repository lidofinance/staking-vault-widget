import { InputProps } from '@lidofinance/lido-ui';
import { FieldConfig } from 'features/create-vault/types';

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
    label: 'by address',
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

export const createVaultFieldsList: FieldConfig[] = [
  {
    name: 'nodeOperator',
    title: 'Node Operator',
    label: 'Node Operator address',
    notes: 'Node Operator address cannot be changed after the vault is created',
    dataType: 'address',
  },
  {
    name: 'assetRecoverer',
    title: 'Asset Recoverer',
    label: 'Asset Recoverer address',
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
    label: 'Vault Manager address or ENS',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorManager', // TODO: remove
    title: 'Node Operator Manager',
    label: 'Node Operator Manager address or ENS',
    dataType: 'address',
  },
  {
    name: 'curatorFeeSetters',
    title: 'Set Vault Curator’s fee',
    dataType: 'address',
  },
  {
    name: 'curatorFeeClaimers',
    title: 'Claim Vault Curator’s fee (address)',
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
    title: 'Initiate validator exit procedure (address)',
    dataType: 'address',
  },
  {
    name: 'validatorWithdrawalTriggerers',
    title:
      'Force NodeOperator to withdraw funds from validator(s) (public key, sum)',
    dataType: 'address',
  },
  {
    name: 'disconnecters',
    title: 'Disconnecters',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorFeeClaimers',
    title: 'Claim NOs fees from the vault (ETH) (address)',
    dataType: 'address',
  },
];

export const getCreateVaultFields = (fieldsList: string[]) => {
  return createVaultFieldsList.filter((field) =>
    fieldsList.includes(field.name),
  );
};
