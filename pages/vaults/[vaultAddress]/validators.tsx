import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';

const Validators: FC = () => {
  return (
    <Layout navigationMode="vault" title="Coming soon" containerSize="content">
      <Head>
        <title>Validators | Lido</title>
      </Head>
    </Layout>
  );
};

export default Validators;
