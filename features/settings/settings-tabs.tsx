import { FC, useState } from 'react';
import { ToggleSwitch } from 'shared/components/toggle';

import { EditMainSettings } from './main';
import { PermissionsSettings } from './permissions';
import { TierSettings } from './tier';

import { PageWrapper } from './styles';

import { SETTINGS_PATHS, SettingsPaths, settingsToggleList } from './const';

const settingsTabsMap: Record<SettingsPaths, FC> = {
  main: EditMainSettings,
  permissions: PermissionsSettings,
  tier: TierSettings,
};

export const SettingsTabs = () => {
  const [mode, setMode] = useState<SettingsPaths>(() => SETTINGS_PATHS.main);
  const CurrentSettings = settingsTabsMap[mode];

  return (
    <PageWrapper>
      <ToggleSwitch
        options={settingsToggleList}
        defaultValue={mode}
        onToggle={({ value }) => setMode(value as SettingsPaths)}
      />
      <CurrentSettings />
    </PageWrapper>
  );
};
