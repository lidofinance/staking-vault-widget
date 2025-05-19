import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { CreateVaultForm } from './create-vault-form';
import { PageWrapper } from './styles';

export const CreateVaultPage: FC = () => {
  return (
    <Layout
      navigationMode="create-vault"
      containerSize="content"
      title="Creating new vault"
    >
      <Head>
        <title>Create Vault | Lido</title>
      </Head>
      <PageWrapper>
        <CreateVaultForm />
      </PageWrapper>
    </Layout>
  );
};
