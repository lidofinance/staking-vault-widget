import { useSettings } from 'features/settings/contexts';

import { ToggleSwitch } from 'shared/components/toggle';
import { FormBlock, PageWrapper } from './styles';
import { EditMainSettings } from './main';
import { PermissionsSettings } from './permissions';

import { SETTINGS_PATHS, SettingsPaths, settingsToggleList } from './const';

export const SettingsTabs = () => {
  const { isMainTab, setSettingsFormMode } = useSettings();

  const handleToggleCb = (value: SettingsPaths) => {
    setSettingsFormMode(value);
  };

  return (
    <PageWrapper>
      <ToggleSwitch
        options={settingsToggleList}
        defaultActive={SETTINGS_PATHS.main}
        onToggle={({ value }) => handleToggleCb(value as SettingsPaths)}
      />
      <FormBlock>
        {isMainTab ? <EditMainSettings /> : <PermissionsSettings />}
      </FormBlock>
    </PageWrapper>
  );
};
