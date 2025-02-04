import { FC } from 'react';

import { Layout } from 'shared/components';
import { SettingsForm } from 'features/settings/settings-form';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

const Settings: FC = () => {
  return (
    <Layout title="Settings">
      <SettingsForm />
    </Layout>
  );
};

export const getStaticProps = getDefaultStaticProps('/settings', async () => {
  return { props: {} };
});

export default Settings;
