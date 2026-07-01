import {
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  type Address,
  type ContractFunctionParameters,
  type MulticallReturnType,
} from 'viem';

import { Multicall3AbiUtils } from 'abi/multicall-abi';
import { type RegisteredPublicClient } from 'modules/web3';
import { QUERY_CLIENT_UNSAFE_REF } from 'providers';

import type { VaultBaseInfo, VaultReportType } from '../types';
import { vaultQueryKeys } from '../consts';

type LazyOracleContract = VaultBaseInfo['lazyOracle'];

type ReadWithReportArgs<
  TContracts extends
    readonly unknown[] = readonly (ContractFunctionParameters & {
    from?: Address;
  })[],
> = {
  publicClient: RegisteredPublicClient;
  lazyOracle: LazyOracleContract;
  contracts: TContracts;
  report: VaultReportType | null;
  isReportFresh: boolean;
  blockNumber?: bigint;
};

export const encodeReportCall = (
  lazyOracle: LazyOracleContract,
  report: VaultReportType,
) => {
  return lazyOracle.encode.updateVaultData([
    report.vault,
    report.totalValueWei,
    report.fee,
    report.liabilityShares,
    report.maxLiabilityShares,
    report.slashingReserve,
    report.proof,
  ]);
};

const readWithoutReport = async <
  TContracts extends readonly (ContractFunctionParameters & {
    from?: Address;
  })[],
>({
  publicClient,
  contracts,
}: Pick<ReadWithReportArgs<TContracts>, 'publicClient' | 'contracts'>): Promise<
  MulticallReturnType<TContracts, false>
> => {
  // if there is only 1 call we can use readContract directly to avoid multicall overhead
  if (contracts.length === 1) {
    return [
      await publicClient.readContract({
        ...contracts[0],
      }),
    ] as unknown as MulticallReturnType<TContracts, false>;
  }

  // fallback multicall when no report is provided
  return (await publicClient.multicall({
    contracts: contracts as any,
    allowFailure: false,
  })) as unknown as MulticallReturnType<TContracts, false>;
};

export const readWithReport = async <
  TContracts extends readonly (ContractFunctionParameters & {
    from?: Address; // this is NOOP for eth_call multicall, but may work with simulateV1
  })[],
>({
  publicClient,
  lazyOracle,
  report,
  isReportFresh,
  contracts,
  blockNumber,
}: ReadWithReportArgs<TContracts>): Promise<
  MulticallReturnType<TContracts, false>
> => {
  if (report && !isReportFresh) {
    // there is logic in lazyOracle that does not allow us to bypass it without proof
    // inclusion of proper tx with proof is not sustainable for rpc load and compute
    // as  proof will gradually become larger
    // we need to find a way to bypass it in the future:
    //
    //      1. calculate short-proof and fake root and state override lazyOracle merkle tree
    //      2. eth_call/eth_simulateV1  stateOverride lazyOracle implementation with proof-less updateVaultData
    //      3. eth_call from impersonate DAO agent or other owner of vault
    //
    //  NB!: stateOverride(or smth with this approach) is buggy with eth_call and eth_simulateV1
    //       causes to report not to apply and all views to use pre-report state
    //
    // EXAMPLE OF STATE OVERRIDE THAT ALLOWS FOR ZERO LENGTH PROOF
    //     stateOverride: [
    //   {
    //     address: lazyOracle.address,
    //     state: [
    //       {
    //         slot: LAZY_ORACLE_ROOT_HASH_SLOT,
    //         value: report.vaultLeafHash,
    //       },
    //     ],
    //   },
    // ],

    const reportCall = lazyOracle.prepare.updateVaultData([
      report.vault,
      report.totalValueWei,
      report.fee,
      report.liabilityShares,
      report.maxLiabilityShares,
      report.slashingReserve,
      report.proof,
    ]);

    // TODO: remove after monitoring error with InvalidProof()
    // Add getBlockNumber call to multicall to get exact block number
    const getBlockNumberCall = {
      abi: Multicall3AbiUtils,
      address: publicClient.chain.contracts.multicall3.address,
      functionName: 'getBlockNumber',
    } as const;

    const allResults = await publicClient.multicall({
      contracts: [reportCall, ...contracts, getBlockNumberCall] as any,
      batchSize: 0, // this forces to use single call batch for all calls
      allowFailure: true,
      blockNumber,
    });

    const reportResult = allResults[0];
    const contractResults = allResults.slice(1, -1);
    const blockNumberResult = allResults[allResults.length - 1];

    if (reportResult?.error) {
      // in case if report is already fresh or new is avaliable invalidate state query
      if (
        reportResult.error instanceof ContractFunctionExecutionError &&
        reportResult.error.cause instanceof ContractFunctionRevertedError &&
        (reportResult.error.cause.data?.errorName ===
          'VaultReportIsFreshEnough' ||
          reportResult.error.cause.data?.errorName === 'InvalidProof')
      ) {
        void QUERY_CLIENT_UNSAFE_REF?.invalidateQueries({
          queryKey: vaultQueryKeys(report.vault, publicClient.chain.id)
            .stateBase,
        });
      } else {
        console.warn(
          `[readWithReport] Report call in multicall failed at block ${blockNumberResult.result} with error`,
          reportResult.error instanceof Error
            ? reportResult.error.message
            : 'Unknown error',
        );
      }
    }

    // emulate allowFailure: false,
    const results = contractResults.map(({ error, result }) => {
      if (error) {
        throw error;
      }
      return result;
    });

    return results as MulticallReturnType<TContracts, false>;
  }

  return readWithoutReport({ publicClient, contracts });
};
