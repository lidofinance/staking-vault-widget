import Head from 'next/head';

import { Layout } from 'shared/components';
import { PageWrapper } from 'features/home/styles';
import { AllVaults } from 'features/home/all-vaults';
import { appPaths } from 'consts/routing';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

export default () => {
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

export const getStaticProps = getDefaultStaticProps(appPaths.vaults.all);
