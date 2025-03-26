import type { FC } from 'react';
import type { GetStaticPaths } from 'next';
import Head from 'next/head';

import { SupplyTabs } from 'features/supply';
import { SupplyProvider } from 'features/supply/contexts';
import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

const Supply: FC<SupplyModePageParams> = ({ mode }) => {
  const title = mode === 'fund' ? 'Supply' : 'Withdraw';

  return (
    <Layout title={title} containerSize="content">
      <Head>
        <title>{title} | Lido</title>
      </Head>
      <SupplyProvider mode={mode}>
        <SupplyTabs />
      </SupplyProvider>
    </Layout>
  );
};

export default Supply;

type SupplyModePageParams = {
  mode: 'fund' | 'withdraw';
};

export const getStaticPaths: GetStaticPaths<
  SupplyModePageParams
> = async () => {
  return {
    paths: [{ params: { mode: 'fund' } }, { params: { mode: 'withdraw' } }],
    fallback: false,
  };
};

export const getStaticProps = getDefaultStaticProps<
  SupplyModePageParams,
  SupplyModePageParams
>('/supply', async ({ params }) => {
  if (!params?.mode) return { notFound: true };
  return { props: { mode: params.mode } };
});
