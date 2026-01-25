import Head from 'next/head';

import { Layout } from 'shared/components';
import { getPageTitle } from 'utils';

import { AllVaults } from './all-vaults';
import { PageWrapper } from '../styles';

export const AllVaultsPage = () => {
  return (
    <Layout containerSize="content">
      <Head>
        <title>{getPageTitle('All Vaults')}</title>
      </Head>
      <PageWrapper>
        <AllVaults />
      </PageWrapper>
    </Layout>
  );
};
