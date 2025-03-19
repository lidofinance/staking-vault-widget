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
