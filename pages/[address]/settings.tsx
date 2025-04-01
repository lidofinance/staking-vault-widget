import { FC } from 'react';
import { Address } from 'viem';

import { Layout } from 'shared/components';
import { VaultProvider } from 'features/overview/contexts';
import { SettingsForm } from 'features/settings/settings-form';

import { getDefaultServerSideProps } from 'utilsApi/get-default-server-side-props';

type SettingsProps = {
  address: Address;
};

const Settings: FC<SettingsProps> = ({ address }) => {
  return (
    <Layout title="Settings" address={address}>
      <VaultProvider address={address}>
        <SettingsForm />
      </VaultProvider>
    </Layout>
  );
};

export default Settings;

export const getServerSideProps = getDefaultServerSideProps;
