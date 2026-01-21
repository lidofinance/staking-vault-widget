import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';

import { MyVaults } from './my-vaults';

import { PageWrapper } from '../styles';

export const MyVaultsPage: FC = () => {
  return (
    <Layout containerSize="content">
      <Head>
        <title>stVaults | Lido</title>
      </Head>
      <PageWrapper>
        <MyVaults />
      </PageWrapper>
    </Layout>
  );
};
