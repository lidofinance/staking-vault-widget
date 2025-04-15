import type { FC } from 'react';
import Head from 'next/head';
import { Address } from 'viem';

import { AdjustmentTabs } from 'features/adjustment';
import { AdjustmentProvider } from 'features/adjustment/contexts';
import { VaultProvider } from 'features/overview/contexts';
import { Layout } from 'shared/components';
import { useRouter } from 'next/router';

type AdjustmentModePageParams = {
  mode: 'mint' | 'repay';
  address: Address;
};

const Adjustment: FC = () => {
  const { mode } = useRouter().query as AdjustmentModePageParams;
  const title = mode === 'mint' ? 'Mint' : 'Repay';

  return (
    <Layout title={title} containerSize="content">
      <Head>
        <title>{title} | Lido</title>
      </Head>
      <VaultProvider>
        <AdjustmentProvider mode={mode}>
          <AdjustmentTabs />
        </AdjustmentProvider>
      </VaultProvider>
    </Layout>
  );
};

export default Adjustment;
