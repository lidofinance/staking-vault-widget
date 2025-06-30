import { FC } from 'react';

import { Layout } from 'shared/components';

import { SettingsTabs } from 'features/settings';

const Settings: FC = () => {
  return (
    <Layout navigationMode="vault" title="Settings" containerSize="content">
      <SettingsTabs />
    </Layout>
  );
};

export default Settings;
