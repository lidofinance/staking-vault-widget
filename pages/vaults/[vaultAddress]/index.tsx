import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { VaultOverview } from 'features/overview';

const Overview: FC = () => {
  return (
    <Layout navigationMode="vault" containerSize="content">
      <Head>
        <title>Vault Overview | Lido</title>
      </Head>
      <VaultOverview />
    </Layout>
  );
};

export default Overview;
