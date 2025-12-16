import type { FC } from 'react';
import Head from 'next/head';
import { Address } from 'viem';

import { AdjustmentTabs } from 'features/adjustment';
import { Layout } from 'shared/components';
import { useRouter } from 'next/router';

type AdjustmentModePageParams = {
  mode: 'mint' | 'repay';
  vaultAddress: Address;
};

const Adjustment: FC = () => {
  const { mode } = useRouter().query as AdjustmentModePageParams;
  const title = mode === 'mint' ? 'Mint' : 'Repay';

  return (
    <Layout navigationMode="vault" title={title} containerSize="content">
      <Head>
        <title>{title} | Lido</title>
      </Head>
      <AdjustmentTabs isMintTab={mode === 'mint'} />
    </Layout>
  );
};

export default Adjustment;
