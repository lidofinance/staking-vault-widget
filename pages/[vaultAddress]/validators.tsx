import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { VaultProvider } from 'features/overview/contexts';

const Validators: FC = () => {
  return (
    <Layout title="Coming soon" containerSize="content">
      <Head>
        <title>Validators | Lido</title>
      </Head>
      <VaultProvider></VaultProvider>
    </Layout>
  );
};

export default Validators;
