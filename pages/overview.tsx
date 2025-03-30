import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

const Overview: FC = () => {
  return (
    <Layout containerSize="content">
      <Head>
        <title>Overview | Lido</title>
      </Head>
    </Layout>
  );
};

export default Overview;

export const getStaticProps = getDefaultStaticProps('/overview', async () => ({
  props: {},
}));
