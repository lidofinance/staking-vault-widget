import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { VaultProvider } from 'features/overview/contexts';
import { OverviewPage } from 'features/overview';

const Overview: FC = () => {
  return (
    <Layout containerSize="content">
      <Head>
        <title>Vault Overview | Lido</title>
      </Head>
      <VaultProvider>
        <OverviewPage />
      </VaultProvider>
    </Layout>
  );
};

export default Overview;
