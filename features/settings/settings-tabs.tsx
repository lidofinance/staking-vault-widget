import { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Address } from 'viem';

import { ToggleSwitch } from 'shared/components/toggle';
import { appPaths } from 'consts/routing';

import { EditMainSettings } from './main';
import { PermissionsSettings } from './permissions';
import { TierSettings } from './tier';

import { PageWrapper } from './styles';

import { SETTINGS_PATHS, SettingsPaths, settingsToggleList } from './const';

type AdjustmentTabPageParams = {
  mode: SETTINGS_PATHS;
  vaultAddress: Address;
};

const settingsTabsMap: Record<SettingsPaths, FC> = {
  main: EditMainSettings,
  permissions: PermissionsSettings,
  tier: TierSettings,
};

export const SettingsTabs = () => {
  const router = useRouter();
  const { mode, vaultAddress } = router.query as AdjustmentTabPageParams;
  const CurrentSettings = settingsTabsMap[mode];

  const changeTab = useCallback(
    (mode: SETTINGS_PATHS) => {
      void router.push(
        {
          pathname: appPaths.vaults.vault(vaultAddress).settings(mode),
          query: {},
        },
        undefined,
        { shallow: true },
      );
    },
    [router, vaultAddress],
  );

  if (!mode || !vaultAddress) return null;

  return (
    <PageWrapper>
      <ToggleSwitch
        options={settingsToggleList}
        defaultValue={mode}
        onToggle={({ value }) => changeTab(value as SettingsPaths)}
      />
      <CurrentSettings />
    </PageWrapper>
  );
};
