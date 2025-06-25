import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { OverviewPage } from 'features/overview/new';

const Overview: FC = () => {
  return (
    <Layout navigationMode="vault" containerSize="content">
      <Head>
        <title>Vault Overview | Lido</title>
      </Head>
      <OverviewPage />
    </Layout>
  );
};

export default Overview;
