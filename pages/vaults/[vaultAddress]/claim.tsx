import type { FC } from 'react';
import Head from 'next/head';

import { ClaimPage } from 'features/claim';
import { Layout } from 'shared/components';

const Claim: FC = () => {
  return (
    <Layout navigationMode="vault" title="Claim" containerSize="content">
      <Head>
        <title>ClaimPage | Lido</title>
      </Head>
      <ClaimPage />
    </Layout>
  );
};

export default Claim;
