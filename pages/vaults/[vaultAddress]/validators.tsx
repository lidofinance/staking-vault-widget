import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { getPageTitle } from 'utils';

const Validators: FC = () => {
  return (
    <Layout navigationMode="vault" title="Coming soon" containerSize="content">
      <Head>
        <title>{getPageTitle('Validators')}</title>
      </Head>
    </Layout>
  );
};

export default Validators;
