import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { HomeContent } from 'features/home/home-content';

import { PageWrapper } from './styles';

export const HomePage: FC = () => {
  return (
    <Layout containerSize="content">
      <Head>
        <title>Vault | Lido</title>
      </Head>
      <PageWrapper>
        <HomeContent />
      </PageWrapper>
    </Layout>
  );
};
