import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { vaultTexts } from 'modules/vaults';
import { getPageTitle } from 'utils';

import { ClaimPage } from 'features/disburse';

const text = vaultTexts.actions.claim;

const Disburse: FC = () => {
  return (
    <Layout navigationMode="vault" title={text.title} containerSize="content">
      <Head>
        <title>{getPageTitle(text.title)}</title>
      </Head>
      <ClaimPage />
    </Layout>
  );
};

export default Disburse;
