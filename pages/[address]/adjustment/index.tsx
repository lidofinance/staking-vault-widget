import type { GetServerSideProps } from 'next';
import { Address } from 'viem';

type AdjustmentIndexPageParams = {
  address: Address;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address } = context.params as AdjustmentIndexPageParams;

  return {
    redirect: {
      destination: `/${address}/adjustment/mint`,
      permanent: true,
    },
  };
};

const AdjustmentIndexPage = () => null;

export default AdjustmentIndexPage;
