import type { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { Address } from 'viem';

import { Layout } from 'shared/components';
import { getPageTitle } from 'utils';

import { FundingTabs } from 'features/funding';

type FundingModePageParams = {
  mode: 'supply' | 'withdraw';
  vaultAddress: Address;
};

const Funding: FC = () => {
  const { mode } = useRouter().query as FundingModePageParams;
  const title = mode === 'supply' ? 'Supply' : 'Withdraw';

  return (
    <Layout navigationMode="vault" title={title} containerSize="content">
      <Head>
        <title>{getPageTitle(title)}</title>
      </Head>

      <FundingTabs mode={mode} />
    </Layout>
  );
};

export default Funding;
