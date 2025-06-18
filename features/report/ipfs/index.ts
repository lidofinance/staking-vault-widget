import jsonBigint from 'json-bigint';
import { Address, Hex } from 'viem';

import { getApiURL } from 'config';
import { CID_TO_GATEWAY } from './ipfs-gateways';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

type IPFSReport = {
  blockNumber: number;
  refSlot: number;
  timestamp: number;

  prevTreeCID: string;
  proofsCID: string;

  merkleTreeRoot: Hex;
  tree: Hex[];
  values: {
    treeIndex: bigint;
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
      const raw = await fetch(url).then((res) => res.text());

      const parsed = jsonBigint({
        alwaysParseAsBig: true,
        strict: true,
        useNativeBigInt: true,
      }).parse(raw);

      return parsed;
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

  const merkleTree = StandardMerkleTree.load({
    ...IPFSReportData,
    values: IPFSReportData.values.map(({ treeIndex, value }) => {
      return {
        value,
        treeIndex: Number(treeIndex),
      };
    }),
  });

  const vaultIndex = IPFSReportData.values.findIndex(
    ({ value }) => value[0].toLowerCase() === vault.toLowerCase(),
  );

  if (vaultIndex < 0) {
    throw new Error(
      `[extractProofFromIPFS]  Vault ${vault} not found in report`,
    );
  }

  const vaultEntry = IPFSReportData.values[vaultIndex];

  return {
    vault: vaultEntry.value[0],
    totalValueWei: BigInt(vaultEntry.value[1]),
    fee: BigInt(vaultEntry.value[2]),
    liabilityShares: BigInt(vaultEntry.value[3]),
    slashingReserve: BigInt(vaultEntry.value[4]),
    proof: merkleTree.getProof(vaultIndex) as Hex[],
  };
};

export const fetchReportMerkle = async (
  chain: number,
  cid: string,
  vault: Address,
) => {
  const url = getApiURL(chain, 'vaultApi');
  if (url) {
    throw new Error('not implemented');
  }

  // fallback
  return await extractProofFromIPFS(cid, vault);
};
