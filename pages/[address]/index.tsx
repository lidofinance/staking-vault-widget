import type { GetServerSideProps } from 'next';
import { Address } from 'viem';
import { AppPaths } from 'consts/urls';

type VaultAddressIndexPageParams = {
  address: Address;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address } = context.params as VaultAddressIndexPageParams;

  return {
    redirect: {
      destination: `/${address}${AppPaths.overview}`,
      permanent: true,
    },
  };
};

const VaultAddressIndexPage = () => null;

export default VaultAddressIndexPage;
