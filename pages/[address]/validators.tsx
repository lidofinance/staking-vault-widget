import type { FC } from 'react';
import Head from 'next/head';
import { Address } from 'viem';

import { Layout } from 'shared/components';
import { VaultProvider } from 'features/overview/contexts';
import { getDefaultServerSideProps } from 'utilsApi/get-default-server-side-props';

type ValidatorsParams = {
  address: Address;
};

const Validators: FC<ValidatorsParams> = ({ address }) => {
  return (
    <Layout title="Validators" containerSize="content" address={address}>
      <Head>
        <title>Validators | Lido</title>
      </Head>
      <VaultProvider address={address}></VaultProvider>
    </Layout>
  );
};

export default Validators;

export const getServerSideProps = getDefaultServerSideProps;
