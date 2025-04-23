import { FC } from 'react';

import { Layout } from 'shared/components';
import { SettingsProvider } from 'features/settings/contexts';
import { SettingsTabs } from 'features/settings';

const Settings: FC = () => {
  return (
    <Layout title="Settings" containerSize="content">
      <SettingsProvider>
        <SettingsTabs />
      </SettingsProvider>
    </Layout>
  );
};

export default Settings;
