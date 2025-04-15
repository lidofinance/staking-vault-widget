import type { GetServerSideProps } from 'next';
import { Address } from 'viem';

type SupplyIndexPageParams = {
  vaultAddress: Address;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { vaultAddress } = context.params as SupplyIndexPageParams;

  return {
    redirect: {
      destination: `/${vaultAddress}/supply/fund`,
      permanent: true,
    },
  };
};

const SupplyIndexPage = () => null;

export default SupplyIndexPage;
