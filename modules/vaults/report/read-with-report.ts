import invariant from 'tiny-invariant';
import {
  decodeFunctionResult,
  encodeFunctionData,
  type Address,
  type Hex,
  type ContractFunctionParameters,
  type MulticallReturnType,
  type ContractFunctionName,
  type ContractFunctionReturnType,
  type ContractFunctionArgs,
} from 'viem';
import { useQuery } from '@tanstack/react-query';

import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';

import type { dashboardAbi } from 'abi/dashboard-abi';
import { getLazyOracleContract } from '../contracts';
import { useVault } from '../vault-context';
import type { VaultReportType } from '../types';

const encodeCall = <
  TContract extends ContractFunctionParameters & {
    from?: Address;
  },
>(
  contract: TContract,
) => ({
  to: contract.address,
  data: encodeFunctionData({
    abi: contract.abi,
    functionName: contract.functionName,
    args: contract.args,
  }),
  from: contract.from,
});

const stringifyArgs = (args: unknown): string => {
  return JSON.stringify(args ?? [], (_, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
};

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
  report?: VaultReportType | null,
) => {
  if (!report) return null;

  return encodeCall(
    getLazyOracleContract(publicClient).prepare.updateVaultData([
      report.vault,
      report.totalValueWei,
      report.fee,
      report.liabilityShares,
      report.slashingReserve,
      report.proof,
    ]),
  );
};

export const readWithReport = async <
  TContracts extends readonly (ContractFunctionParameters & {
    from?: Address;
  })[],
>({
  publicClient,
  report,
  contracts,
}: ReadWithReportArgs<TContracts>): Promise<
  MulticallReturnType<TContracts, false>
> => {
  const calls: {
    to: Address;
    data: Hex;
    from?: Address;
  }[] = contracts.map((contract) => encodeCall(contract));

  const reportCall = encodeReportCall(publicClient, report);
  if (reportCall) {
    calls.unshift(reportCall);
    const simulateData = await publicClient.simulateCalls({ calls });
    const results = simulateData.results;

    results.shift();

    const parsedResults = results.map(({ data }, index) => {
      const { abi, functionName, args } = contracts[index];
      return decodeFunctionResult({
        abi,
        functionName,
        args,
        data: data,
      });
    });

    return parsedResults as MulticallReturnType<TContracts, false>;
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

export const useReadDashboard = <
  TMutability extends 'pure' | 'view' | 'nonpayable' | 'payable',
  TFunctionName extends ContractFunctionName<
    typeof dashboardAbi,
    TMutability
  > = ContractFunctionName<typeof dashboardAbi, TMutability>,
  TArgs extends ContractFunctionArgs<
    typeof dashboardAbi,
    TMutability,
    TFunctionName
  > = ContractFunctionArgs<typeof dashboardAbi, TMutability, TFunctionName>,
  TResult extends ContractFunctionReturnType<
    typeof dashboardAbi,
    TMutability,
    TFunctionName
  > = ContractFunctionReturnType<
    typeof dashboardAbi,
    TMutability,
    TFunctionName
  >,
  TSelectData = TResult,
>({
  functionName,
  args,
  enabled = true,
  select,
  applyReport = false,
}: {
  functionName: TFunctionName;
  select?: (data: TResult) => TSelectData;
  enabled?: boolean;
  applyReport?: boolean;
} & ([] extends TArgs ? { args?: undefined } : { args: TArgs })) => {
  const { publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();
  const query = useQuery({
    queryKey: [
      ...queryKeys.state,
      'read-with-report',
      functionName,
      stringifyArgs(args),
    ] as const,
    enabled: !!activeVault && enabled,
    select,
    queryFn: async () => {
      invariant(
        activeVault,
        '[useReadWithVaultReport] activeVault is not defined',
      );

      // @ts-expect-error cannot match types
      const contractData = activeVault.dashboard.prepare[functionName](args);

      return (
        await readWithReport({
          publicClient,
          contracts: [contractData],
          report: applyReport ? activeVault.report : null,
        })
      )[0];
    },
  });

  return query;
};
