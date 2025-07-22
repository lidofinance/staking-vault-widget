import type { FC } from 'react';
import Head from 'next/head';
import { Address } from 'viem';

import { Layout } from 'shared/components';
import { FundingTabs } from 'features/funding';
import { useRouter } from 'next/router';

type FundingModePageParams = {
  mode: 'supply' | 'withdraw';
  address: Address;
};

const Funding: FC = () => {
  const { mode } = useRouter().query as FundingModePageParams;
  const title = mode === 'supply' ? 'Supply' : 'Withdraw';

  return (
    <Layout navigationMode="vault" title={title} containerSize="content">
      <Head>
        <title>{title} | Lido</title>
      </Head>

      <FundingTabs mode={mode} />
    </Layout>
  );
};

export default Funding;
