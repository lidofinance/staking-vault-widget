import {
  type Address,
  type ContractFunctionParameters,
  type MulticallReturnType,
} from 'viem';

import { type RegisteredPublicClient } from 'modules/web3';

import { getLazyOracleContract } from '../contracts';
import type { VaultReportType } from '../types';
import { LAZY_ORACLE_ROOT_HASH_SLOT } from '../consts';

type ReadWithReportArgs<
  TContracts extends
    readonly unknown[] = readonly (ContractFunctionParameters & {
    from?: Address;
  })[],
> = {
  publicClient: RegisteredPublicClient;
  contracts: TContracts;
  report?: VaultReportType | null;
};

export const encodeReportCall = (
  publicClient: RegisteredPublicClient,
  report: VaultReportType,
) => {
  return getLazyOracleContract(publicClient).encode.updateVaultData([
    report.vault,
    report.totalValueWei,
    report.fee,
    report.liabilityShares,
    report.slashingReserve,
    report.proof,
  ]);
};

export const readWithReport = async <
  TContracts extends readonly (ContractFunctionParameters & {
    from?: Address; // this is NOOP for eth_call multicall, but may work with simulateV1
  })[],
>({
  publicClient,
  report,
  contracts,
}: ReadWithReportArgs<TContracts>): Promise<
  MulticallReturnType<TContracts, false>
> => {
  if (report) {
    // there is logic in lazyOracle that does not allow us to bypass it without proof
    // inclusion of proper tx with proof is not sustainable for rpc load and compute
    // as  proof will gradually become larger
    // we need to find a way to bypass it in the future:
    //
    // using now ->  1. calculate short-proof and fake root and state override lazyOracle merkle tree
    //               2. eth_call/eth_simulateV1  stateOverride lazyOracle implementation with proof-less updateVaultData
    //               3. eth_call from impersonate DAO agent or other owner of vault
    //               4. ...

    const lazyOracle = getLazyOracleContract(publicClient);

    const reportCall = lazyOracle.prepare.updateVaultData([
      report.vault,
      report.totalValueWei,
      report.fee,
      report.liabilityShares,
      report.slashingReserve,
      [],
    ]);

    const [, ...results] = await publicClient.multicall({
      contracts: [reportCall, ...contracts] as any,
      allowFailure: false,
      stateOverride: [
        {
          address: lazyOracle.address,
          state: [
            {
              slot: LAZY_ORACLE_ROOT_HASH_SLOT,
              value: report.vaultLeftHash,
            },
          ],
        },
      ],
    });

    return results as MulticallReturnType<TContracts, false>;
  }

  // if there is only 1 call we can use readContract directly to avoid multicall overhead
  if (contracts.length === 1) {
    return [
      await publicClient.readContract({
        ...contracts[0],
      }),
    ] as unknown as MulticallReturnType<TContracts, false>;
  }

  // fallback multicall when no report is provided
  return publicClient.multicall({
    contracts: contracts as any,
    allowFailure: false,
  }) as unknown as MulticallReturnType<TContracts, false>;
};
