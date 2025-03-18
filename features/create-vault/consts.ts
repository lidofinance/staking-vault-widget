export const CREATE_VAULT_STEPS = 3;

export const permissionsToggleList = [
  {
    value: 'by_permission',
    label: 'by Permission',
  },
  {
    value: 'by_address',
    label: 'by address',
  },
];

export type ToggleValue = (typeof permissionsToggleList)[number]['value'];

export const steps: Record<number, string> = {
  '1': 'Main settings',
  '2': 'Permissions',
  '3': 'Confirmation',
};

export const getSectionNameByStep = (step: number) => steps[step];
