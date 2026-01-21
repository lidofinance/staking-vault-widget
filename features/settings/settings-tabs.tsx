import { type FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { trackEvent } from '@lidofinance/analytics-matomo';
import type { Address } from 'viem';

import { ToggleSwitch } from 'shared/components/toggle';
import { appPaths } from 'consts/routing';
import {
  MATOMO_CLICK_EVENTS_TYPES,
  MATOMO_CLICK_EVENTS,
} from 'consts/matomo-click-events';

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

const tabsEventMap = {
  main: MATOMO_CLICK_EVENTS_TYPES.clickSettingsMainSettingsTab,
  permissions: MATOMO_CLICK_EVENTS_TYPES.clickSettingsPermissionsTab,
  tier: MATOMO_CLICK_EVENTS_TYPES.clickSettingsTierTab,
} as const;

export const SettingsTabs = () => {
  const router = useRouter();
  const { mode, vaultAddress } = router.query as AdjustmentTabPageParams;
  const CurrentSettings = settingsTabsMap[mode];

  const changeTab = useCallback(
    (mode: SETTINGS_PATHS) => {
      trackEvent(...MATOMO_CLICK_EVENTS[tabsEventMap[mode]]);

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
