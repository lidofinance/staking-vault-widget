import { type FC, useCallback } from 'react';

import { ToggleCbPayload, ToggleSwitch } from 'shared/components/toggle';
import { useVault } from 'modules/vaults';

import {
  SETTINGS_PATHS,
  SettingsPaths,
  settingsToggleList,
} from 'features/settings/const';

type SettingsNavigationProps = {
  mode: SETTINGS_PATHS;
  changeTab: (mode: SETTINGS_PATHS) => void;
};

export const SettingsNavigation: FC<SettingsNavigationProps> = ({
  mode,
  changeTab,
}) => {
  const { activeVault } = useVault();
  const { isVaultDisconnected = false, isPendingDisconnect = false } =
    activeVault ?? {};

  const handleToggle = useCallback(
    ({ value }: ToggleCbPayload<string>) => changeTab(value as SettingsPaths),
    [changeTab],
  );

  if (isVaultDisconnected || isPendingDisconnect) {
    return null;
  }

  return (
    <ToggleSwitch
      options={settingsToggleList}
      defaultValue={mode}
      onToggle={handleToggle}
    />
  );
};
