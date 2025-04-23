export enum SETTINGS_PATHS {
  main = 'main',
  permissions = 'permissions',
}

export type SettingsPaths =
  (typeof SETTINGS_PATHS)[keyof typeof SETTINGS_PATHS];

export const settingsToggleList: { value: SettingsPaths; label: string }[] = [
  {
    value: SETTINGS_PATHS.main,
    label: 'main settings',
  },
  {
    value: SETTINGS_PATHS.permissions,
    label: 'permissions',
  },
];
