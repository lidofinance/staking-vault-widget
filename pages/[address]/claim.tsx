import type { FC } from 'react';
import Head from 'next/head';
import { Address } from 'viem';

import { ClaimPage } from 'features/claim';
import { Layout } from 'shared/components';
import { VaultProvider } from 'features/overview/contexts';

import { getDefaultServerSideProps } from 'utilsApi/get-default-server-side-props';

type ClaimProps = {
  address: Address;
};

const Claim: FC<ClaimProps> = ({ address }) => {
  return (
    <Layout title="Claim" containerSize="content" address={address}>
      <Head>
        <title>ClaimPage | Lido</title>
      </Head>
      <VaultProvider address={address}>
        <ClaimPage />
      </VaultProvider>
    </Layout>
  );
};

export default Claim;

export const getServerSideProps = getDefaultServerSideProps;
