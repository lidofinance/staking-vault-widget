import jsonBigint from 'json-bigint';
import { Address, Hex } from 'viem';

import { getApiURL } from 'config';
import { CID_TO_GATEWAY } from './ipfs-gateways';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

type IPFSReport = {
  blockNumber: bigint;
  format: 'standard-v1';
  refSlot: bigint;
  timestamp: bigint;
  leafEncoding: ['address', 'uint256', 'uint256', 'uint256', 'uint256'];
  leafIndexToData: {
    0: 'vault_address';
    1: 'total_value_wei';
    2: 'in_out_delta';
    3: 'fee';
    4: 'liability_shares';
  };
  merkleTreeRoot: Hex;
  prevTreeCID: string;
  proofsCID: string;
  tree: string[];
  values: {
    treeIndex: bigint;
    value: [Address, bigint, bigint, bigint, bigint];
  }[];
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

// This mid-lvl cache simplifies fetching IPFS reports between multiple vault queries
// allowing us to not to rely on correct HTTP cache-headers for IPFS
const REPORT_CACHE = new Map<string, IPFSReport>();

const extractProofFromIPFS = async (cid: string, vault: Address) => {
  const inCache = REPORT_CACHE.get(cid);
  const IPFSReportData = inCache ?? (await fetchIPFS<IPFSReport>(cid));
  !inCache && REPORT_CACHE.set(cid, IPFSReportData);

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
    totalValueWei: vaultEntry.value[1],
    inOutDelta: vaultEntry.value[2],
    fee: vaultEntry.value[3],
    liabilityShares: vaultEntry.value[4],
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
