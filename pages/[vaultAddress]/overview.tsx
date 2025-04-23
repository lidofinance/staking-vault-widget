import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { OverviewPage } from 'features/overview';

const Overview: FC = () => {
  return (
    <Layout containerSize="content">
      <Head>
        <title>Vault Overview | Lido</title>
      </Head>
      <OverviewPage />
    </Layout>
  );
};

export default Overview;
