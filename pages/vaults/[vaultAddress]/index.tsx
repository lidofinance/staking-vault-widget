import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { getPageTitle } from 'utils';

import { VaultOverview } from 'features/overview';

const Overview: FC = () => {
  return (
    <Layout navigationMode="vault" containerSize="content">
      <Head>
        <title>{getPageTitle('Vault Overview')}</title>
      </Head>
      <VaultOverview />
    </Layout>
  );
};

export default Overview;
