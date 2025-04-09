import { FC } from 'react';

import { Layout } from 'shared/components';
import { VaultProvider } from 'features/overview/contexts';
import { SettingsForm } from 'features/settings/settings-form';

const Settings: FC = () => {
  return (
    <Layout title="Settings">
      <VaultProvider>
        <SettingsForm />
      </VaultProvider>
    </Layout>
  );
};

export default Settings;
