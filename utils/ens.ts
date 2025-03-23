import { PublicClient } from 'viem';
import { getEnsAddress, normalize } from 'viem/ens';

export const resolveEns = async (value: string, publicClient: PublicClient) => {
  return await getEnsAddress(publicClient, {
    name: normalize(value),
  });
};

const regex = new RegExp('[-a-zA-Z0-9@._]{1,256}.eth');
export const isValidEns = (ens: string) => regex.test(ens);
