import jsonBigint from 'json-bigint';
import { Address, getAddress, Hex } from 'viem';

import { getApiURL } from 'config';
import { CID_TO_GATEWAY } from './ipfs-gateways';

export const fetchIPFS = async <TResult>(cid: string): Promise<TResult> => {
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

export const extractVaultProof = (
  vault: Address,
  proofsData: IPFSReportProofs,
) => {
  const vaultEntry = proofsData.proofs[getAddress(vault)];
  if (!vaultEntry) {
    throw new Error(`[extractVaultProof]  Vault ${vault} not found in report`);
  }
  return vaultEntry;
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
  // fallback to IPFS
  const IPFSReportData = await fetchIPFS<IPFSReport>(cid);
  const IPFSReportsProofs = await fetchIPFS<IPFSReportProofs>(
    IPFSReportData.proofsCID,
  );
  return extractVaultProof(vault, IPFSReportsProofs);
};

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

type IPFSReportProofs = {
  merkleTreeRoot: Hex;
  refSlot: bigint;
  proofs: {
    [key: string]: {
      id: bigint;
      totalValueWei: bigint;
      inOutDelta: bigint;
      fee: bigint;
      liabilityShares: bigint;
      leaf: Hex;
      proof: Hex[];
    };
  };
};
