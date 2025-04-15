import type { GetServerSideProps } from 'next';
import { Address } from 'viem';

type AdjustmentIndexPageParams = {
  vaultAddress: Address;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { vaultAddress } = context.params as AdjustmentIndexPageParams;

  return {
    redirect: {
      destination: `/${vaultAddress}/adjustment/mint`,
      permanent: true,
    },
  };
};

const AdjustmentIndexPage = () => null;

export default AdjustmentIndexPage;
