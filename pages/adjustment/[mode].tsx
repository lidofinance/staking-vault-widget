import type { FC } from 'react';
import type { GetStaticPaths } from 'next';
import Head from 'next/head';

import { AdjustmentTabs } from 'features/adjustment';
import { AdjustmentProvider } from 'features/adjustment/contexts';
import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

const Adjustment: FC<AdjustmentModePageParams> = ({ mode }) => {
  const title = mode === 'mint' ? 'Mint' : 'Repay';

  return (
    <Layout title={title} containerSize="content">
      <Head>
        <title>{title} | Lido</title>
      </Head>
      <AdjustmentProvider mode={mode}>
        <AdjustmentTabs />
      </AdjustmentProvider>
    </Layout>
  );
};

export default Adjustment;

type AdjustmentModePageParams = {
  mode: 'mint' | 'repay';
};

export const getStaticPaths: GetStaticPaths<
  AdjustmentModePageParams
> = async () => {
  return {
    paths: [{ params: { mode: 'mint' } }, { params: { mode: 'repay' } }],
    fallback: false,
  };
};

export const getStaticProps = getDefaultStaticProps<
  AdjustmentModePageParams,
  AdjustmentModePageParams
>('/adjustment', async ({ params }) => {
  if (!params?.mode) return { notFound: true };
  return { props: { mode: params.mode } };
});
