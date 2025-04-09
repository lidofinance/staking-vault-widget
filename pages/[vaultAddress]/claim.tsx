import type { FC } from 'react';
import Head from 'next/head';

import { ClaimPage } from 'features/claim';
import { Layout } from 'shared/components';
import { VaultProvider } from 'features/overview/contexts';

const Claim: FC = () => {
  return (
    <Layout title="Claim" containerSize="content">
      <Head>
        <title>ClaimPage | Lido</title>
      </Head>
      <VaultProvider>
        <ClaimPage />
      </VaultProvider>
    </Layout>
  );
};

export default Claim;
