import type { FC } from 'react';
import Head from 'next/head';

import { Layout } from 'shared/components';
import { RebalancePage } from 'features/rebalance';
import { getPageTitle } from 'utils';
import { vaultTexts } from 'modules/vaults';

const title = vaultTexts.actions.rebalance.title;

const Rebalance: FC = () => {
  return (
    <Layout navigationMode="vault" title={title} containerSize="content">
      <Head>
        <title>{getPageTitle(title)}</title>
      </Head>
      <RebalancePage />
    </Layout>
  );
};

export default Rebalance;
