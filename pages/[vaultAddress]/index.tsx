import type { GetServerSideProps } from 'next';
import { Address } from 'viem';
import { AppPaths } from 'consts/urls';

type VaultAddressIndexPageParams = {
  vaultAddress: Address;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { vaultAddress } = context.params as VaultAddressIndexPageParams;

  return {
    redirect: {
      destination: `/${vaultAddress}${AppPaths.overview}`,
      permanent: true,
    },
  };
};

const VaultAddressIndexPage = () => null;

export default VaultAddressIndexPage;
