export enum SETTINGS_PATHS {
  main = 'main',
  permissions = 'permissions',
  tier = 'tier',
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
  {
    value: SETTINGS_PATHS.tier,
    label: 'tier',
  },
];
