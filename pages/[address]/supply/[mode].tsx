import type { FC } from 'react';
import Head from 'next/head';
import { Address } from 'viem';

import { Layout } from 'shared/components';
import { SupplyTabs } from 'features/supply';
import { SupplyProvider } from 'features/supply/contexts';
import { VaultProvider } from 'features/overview/contexts';
import { useRouter } from 'next/router';

type SupplyModePageParams = {
  mode: 'fund' | 'withdraw';
  address: Address;
};

const Supply: FC = () => {
  const { address, mode } = useRouter().query as SupplyModePageParams;
  const title = mode === 'fund' ? 'Supply' : 'Withdraw';

  return (
    <Layout title={title} address={address} containerSize="content">
      <Head>
        <title>{title} | Lido</title>
      </Head>
      <VaultProvider address={address}>
        <SupplyProvider mode={mode}>
          <SupplyTabs />
        </SupplyProvider>
      </VaultProvider>
    </Layout>
  );
};

export default Supply;
