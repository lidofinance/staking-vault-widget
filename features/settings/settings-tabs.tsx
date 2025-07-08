import { useState } from 'react';
import { ToggleSwitch } from 'shared/components/toggle';

import { EditMainSettings } from './main';
import { PermissionsSettings } from './permissions';
import { FormBlock, PageWrapper } from './styles';

import { SETTINGS_PATHS, SettingsPaths, settingsToggleList } from './const';

export const SettingsTabs = () => {
  const [mode, setMode] = useState<SettingsPaths>(() => SETTINGS_PATHS.main);
  const isMainTab = mode === SETTINGS_PATHS.main;

  return (
    <PageWrapper>
      <ToggleSwitch
        options={settingsToggleList}
        defaultValue={mode}
        onToggle={({ value }) => setMode(value as SettingsPaths)}
      />
      <FormBlock>
        {isMainTab ? <EditMainSettings /> : <PermissionsSettings />}
      </FormBlock>
    </PageWrapper>
  );
};
