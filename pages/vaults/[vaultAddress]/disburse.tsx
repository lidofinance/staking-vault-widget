import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { vaultTexts } from 'modules/vaults';
import { getPageTitle } from 'utils';

import { DisbursePage } from 'features/disburse';

const text = vaultTexts.actions.disburse;

const Disburse: FC = () => {
  return (
    <Layout navigationMode="vault" title={text.title} containerSize="content">
      <Head>
        <title>{getPageTitle(text.title)}</title>
      </Head>
      <DisbursePage />
    </Layout>
  );
};

export default Disburse;
