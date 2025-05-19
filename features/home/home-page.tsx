import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';

import { PageWrapper } from './styles';
import { MyVaults } from './my-vaults';

export const HomePage: FC = () => {
  return (
    <Layout containerSize="content">
      <Head>
        <title>Vault | Lido</title>
      </Head>
      <PageWrapper>
        <MyVaults />
      </PageWrapper>
    </Layout>
  );
};
