import type { FC } from 'react';
import Head from 'next/head';
import { Address } from 'viem';

import { Layout } from 'shared/components';
import { VaultProvider } from 'features/overview/contexts';
import { OverviewPage } from 'features/overview';
import { getDefaultServerSideProps } from 'utilsApi/get-default-server-side-props';

type OverviewParams = {
  address: Address;
};

const Overview: FC<OverviewParams> = ({ address }) => {
  return (
    <Layout title="Overview" containerSize="content" address={address}>
      <Head>
        <title>Vault Overview | Lido</title>
      </Head>
      <VaultProvider address={address}>
        <OverviewPage />
      </VaultProvider>
    </Layout>
  );
};

export default Overview;

// TODO: app structure
// return fetching data by hooks on main page
// make provider as wrapper for [address] pages

export const getServerSideProps = getDefaultServerSideProps;
