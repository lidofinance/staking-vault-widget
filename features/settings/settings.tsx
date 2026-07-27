import { type FC, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { Address } from 'viem';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { ToggleSwitch } from 'shared/components/toggle';
import { appPaths } from 'consts/routing';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { getPageTitle } from 'utils';
import { DisconnectedVault, Layout } from 'shared/components';

import { EditMainSettings } from './main';
import { PermissionsSettings } from './permissions';
import { TierSettings } from './tier';
import { DisconnectVault } from './disconnect';

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
  disconnect: DisconnectVault,
};

const tabsEventMap = {
  main: MATOMO_CLICK_EVENTS_TYPES.clickSettingsMainSettingsTab,
  permissions: MATOMO_CLICK_EVENTS_TYPES.clickSettingsPermissionsTab,
  tier: MATOMO_CLICK_EVENTS_TYPES.clickSettingsTierTab,
} as const;

const titleMap: Record<SETTINGS_PATHS, string> = {
  main: 'Settings',
  permissions: 'Permissions',
  tier: 'Tier Settings',
  disconnect: 'Disconnect',
};

export const Settings = () => {
  const router = useRouter();
  const { mode, vaultAddress } = router.query as AdjustmentTabPageParams;
  const CurrentSettings = settingsTabsMap[mode];

  const changeTab = useCallback(
    (mode: SETTINGS_PATHS) => {
      if (mode === 'disconnect') {
        return;
      }

      trackMatomoEvent(tabsEventMap[mode]);

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

  const title = useMemo(() => {
    if (!mode || mode === 'disconnect') {
      return null;
    }

    return 'Settings';
  }, [mode]);

  if (!mode || !vaultAddress) return null;

  return (
    <Layout navigationMode="vault" title={title} containerSize="content">
      <PageWrapper>
        {mode !== 'disconnect' && (
          <>
            <Head>
              <title>{getPageTitle(titleMap[mode])}</title>
            </Head>
            <DisconnectedVault />
            <ToggleSwitch
              options={settingsToggleList}
              defaultValue={mode}
              onToggle={({ value }) => changeTab(value as SettingsPaths)}
            />
          </>
        )}
        <CurrentSettings />
      </PageWrapper>
    </Layout>
  );
};
