import { FC } from 'react';

import { Layout } from 'shared/components';
import { SettingsProvider } from 'features/settings/contexts';
import { SettingsTabs } from 'features/settings';

const Settings: FC = () => {
  return (
    <Layout navigationMode="vault" title="Settings" containerSize="content">
      <SettingsProvider>
        <SettingsTabs />
      </SettingsProvider>
    </Layout>
  );
};

export default Settings;
