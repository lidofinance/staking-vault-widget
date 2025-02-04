import Head from 'next/head';

import { Layout } from 'shared/components';

import type { FC } from 'react';

export const HomePage: FC = () => {
  return (
    <Layout title="" subtitle="">
      <Head>
        <title>Vault | Lido</title>
      </Head>
    </Layout>
  );
};
