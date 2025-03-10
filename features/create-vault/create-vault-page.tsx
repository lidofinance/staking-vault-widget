import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { CreateFormProvider } from 'features/create-vault/create-vault-form/create-vault-form-context';
import { MainSettings } from 'features/create-vault/create-vault-form/main-settings';
import { Permissions } from 'features/create-vault/create-vault-form/permissions';
import { Confirmation } from 'features/create-vault/create-vault-form/confirmation';
import { CreateVaultFaq } from 'features/create-vault/create-vault-faq';
import { FormContainer } from 'features/create-vault/create-vault-form/form-container';
import { PageWrapper } from './styles';

export const CreateVaultPage: FC = () => {
  return (
    <Layout containerSize="content" title="Creating new vault">
      <Head>
        <title>Create Vault | Lido</title>
      </Head>
      <PageWrapper>
        <CreateFormProvider>
          <FormContainer>
            <MainSettings />
            <Permissions />
            <Confirmation />
          </FormContainer>
        </CreateFormProvider>
        <CreateVaultFaq />
      </PageWrapper>
    </Layout>
  );
};
