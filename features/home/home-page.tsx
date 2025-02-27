import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { MyVaults } from 'features/home/my-vaults';
import { AllVaults } from 'features/home/all-vaults';

import { PageWrapper } from './styles';

export const HomePage: FC = () => {
  return (
    <Layout containerSize="content">
      <Head>
        <title>Vault | Lido</title>
      </Head>
      <PageWrapper>
        <MyVaults />
        <AllVaults />
      </PageWrapper>
    </Layout>
  );
};
