import type { GetServerSideProps } from 'next';
import { Address } from 'viem';

type SupplyIndexPageParams = {
  address: Address;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address } = context.params as SupplyIndexPageParams;

  return {
    redirect: {
      destination: `/${address}/supply/fund`,
      permanent: true,
    },
  };
};

const SupplyIndexPage = () => null;

export default SupplyIndexPage;
