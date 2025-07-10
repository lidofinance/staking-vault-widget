import { Address, Hex } from 'viem';

import { getApiURL } from 'config';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { CID_TO_GATEWAY } from './ipfs-gateways';

type IPFSReport = {
  blockNumber: number;
  refSlot: number;
  timestamp: number;

  prevTreeCID: string;
  proofsCID: string;

  merkleTreeRoot: Hex;
  tree: Hex[];
  values: {
    treeIndex: number;
    value: [Address, string, string, string, string];
  }[];
  format: 'standard-v1';
  leafEncoding: ['address', 'uint256', 'uint256', 'uint256', 'int256'];
  leafIndexToData: {
    '0': 'vault_address';
    '1': 'total_value_wei';
    '2': 'fee';
    '3': 'liability_shares';
    '4': 'slashing_reserve';
  };
};

const fetchIPFS = async <TResult>(cid: string): Promise<TResult> => {
  for (const gateway of CID_TO_GATEWAY) {
    const url = gateway(cid);
    try {
      return await fetch(url).then((res) => res.json());
    } catch (error) {
      console.warn(
        `Error fetching from IPFS gateway(${url}). Trying next...`,
        error,
      );
    }
  }
  throw new Error('Could not fetch report from IPFS');
};

const extractProofFromIPFS = async (cid: string, vault: Address) => {
  const IPFSReportData = await fetchIPFS<IPFSReport>(cid);

  const merkleTree = StandardMerkleTree.load(IPFSReportData);

  const vaultIndex = IPFSReportData.values.findIndex(
    ({ value }) => value[0].toLowerCase() === vault.toLowerCase(),
  );

  if (vaultIndex < 0) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const vaultEntry = merkleTree.at(vaultIndex)!;

  return {
    vault: vaultEntry[0],
    totalValueWei: BigInt(vaultEntry[1]),
    fee: BigInt(vaultEntry[2]),
    liabilityShares: BigInt(vaultEntry[3]),
    slashingReserve: BigInt(vaultEntry[4]),
    proof: merkleTree.getProof(vaultIndex) as Hex[],
    vaultLeftHash: merkleTree.leafHash(vaultEntry) as Hex,
  };
};

export const fetchReportMerkle = async (
  chain: number,
  cid: string,
  vault: Address,
) => {
  const url = getApiURL(chain, 'vaultsApi');
  if (url) {
    throw new Error('not implemented');
  }

  // fallback
  return await extractProofFromIPFS(cid, vault);
};
