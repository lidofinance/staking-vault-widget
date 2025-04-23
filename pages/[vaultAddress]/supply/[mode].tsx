import type { FC } from 'react';
import Head from 'next/head';
import { Address } from 'viem';

import { Layout } from 'shared/components';
import { SupplyTabs } from 'features/supply';
import { useRouter } from 'next/router';

type SupplyModePageParams = {
  mode: 'fund' | 'withdraw';
  address: Address;
};

const Supply: FC = () => {
  const { mode } = useRouter().query as SupplyModePageParams;
  const title = mode === 'fund' ? 'Supply' : 'Withdraw';

  return (
    <Layout title={title} containerSize="content">
      <Head>
        <title>{title} | Lido</title>
      </Head>

      <SupplyTabs mode={mode} />
    </Layout>
  );
};

export default Supply;
