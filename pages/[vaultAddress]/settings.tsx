import { FC } from 'react';

import { Layout } from 'shared/components';
import { VaultProvider } from 'features/overview/contexts';
import { SettingsProvider } from 'features/settings/contexts';
import { SettingsTabs } from 'features/settings';

const Settings: FC = () => {
  return (
    <Layout title="Settings" containerSize="content">
      <VaultProvider>
        <SettingsProvider>
          <SettingsTabs />
        </SettingsProvider>
      </VaultProvider>
    </Layout>
  );
};

export default Settings;
