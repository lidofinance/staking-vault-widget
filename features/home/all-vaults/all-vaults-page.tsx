import Head from 'next/head';

import { Layout } from 'shared/components';

import { AllVaults } from './all-vaults';
import { PageWrapper } from '../styles';

export const AllVaultsPage = () => {
  return (
    <Layout containerSize="content">
      <Head>
        <title>Vault | Lido</title>
      </Head>
      <PageWrapper>
        <AllVaults />
      </PageWrapper>
    </Layout>
  );
};
