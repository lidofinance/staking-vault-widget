import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { ValidatorsPage } from 'features/validators';
import { getPageTitle } from 'utils';
import { vaultTexts } from 'modules/vaults';

const title = vaultTexts.actions.validators.title;

const Validators: FC = () => {
  return (
    <Layout navigationMode="vault" title={title} containerSize="content">
      <Head>
        <title>{getPageTitle('Validators')}</title>
      </Head>
      <ValidatorsPage />
    </Layout>
  );
};

export default Validators;
