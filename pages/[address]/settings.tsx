import { FC } from 'react';
import { Address } from 'viem';

import { Layout } from 'shared/components';
import { VaultProvider } from 'features/overview/contexts';
import { SettingsProvider } from 'features/settings/contexts';
import { SettingsTabs } from 'features/settings';

import { getDefaultServerSideProps } from 'utilsApi/get-default-server-side-props';

type SettingsParams = {
  address: Address;
};

const Settings: FC<SettingsParams> = ({ address }) => {
  return (
    <Layout title="Settings">
      <VaultProvider address={address}>
        <SettingsProvider>
          <SettingsTabs />
        </SettingsProvider>
      </VaultProvider>
    </Layout>
  );
};

export default Settings;

export const getServerSideProps = getDefaultServerSideProps;
