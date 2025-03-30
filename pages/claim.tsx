import type { FC } from 'react';
import Head from 'next/head';

import { ClaimPage } from 'features/claim';
import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

const Claim: FC = () => {
  return (
    <Layout title="Claim" containerSize="content">
      <Head>
        <title>ClaimPage | Lido</title>
      </Head>
      <ClaimPage />
    </Layout>
  );
};

export default Claim;

export const getStaticProps = getDefaultStaticProps('/claim', async () => ({
  props: {},
}));
