import { createPublicClient, http, isAddress } from 'viem';
import { sepolia } from 'viem/chains';
import { StakingVaultAbi } from '../abi/vault';
import { getVaultHubAddress } from '../consts/vault-hub';
import { GetServerSideProps } from 'next';

interface ServerSideProps {
  address: string;
}

// Check if address is address
// Check if address is deployed contract
// Check if address is vault contract
export const getDefaultServerSideProps: GetServerSideProps<
  ServerSideProps
> = async (context) => {
  const { address } = context.params as { address: string };

  try {
    if (!isAddress(address)) {
      throw new Error('Address is not valid ethereum address');
    }

    // TODO: get current chain
    const client = createPublicClient({
      chain: sepolia,
      transport: http(),
    });

    const bytecode = await client.getBytecode({ address });
    if (!bytecode || bytecode === '0x') {
      throw new Error('Contract is not deployed');
    }

    const vaultHubAddress = await client.readContract({
      address,
      abi: StakingVaultAbi,
      functionName: 'vaultHub',
    });

    const currentHubAddress = getVaultHubAddress(11155111);
    if (vaultHubAddress !== currentHubAddress) {
      throw new Error('VaultHub address is is not correct');
    }

    return {
      props: { address },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};
