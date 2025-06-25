import {
  decodeFunctionResult,
  encodeFunctionData,
  type Address,
  type Hex,
  type ContractFunctionParameters,
  type MulticallReturnType,
  ContractFunctionName,
  ContractFunctionReturnType,
  ContractFunctionArgs,
} from 'viem';
import { useVaultInfo } from '../vault-context';
import { useQuery } from '@tanstack/react-query';
import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import invariant from 'tiny-invariant';
import type { dashboardAbi } from 'abi/dashboard-abi';
import { getLazyOracleContract } from '../contracts';
import { VaultReportType } from '../types';

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
    getLazyOracleContract(publicClient).encode.updateVaultData([
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

export const useReadWithVaultReport = <
  TContracts extends readonly (
    | (ContractFunctionParameters & {
        from?: Address;
      })
    | undefined
  )[],
>(
  contracts: TContracts,
) => {
  const { publicClient } = useLidoSDK();
  const { activeVault } = useVaultInfo();
  const query = useQuery<MulticallReturnType<Required<TContracts>, false>>({
    meta: { contracts },
    queryKey: [
      'read-with-report',
      activeVault?.address,
      activeVault?.reportCID,
      contracts,
    ] as const,
    enabled:
      !!activeVault && contracts.length > 0 && !contracts.some((c) => !c),
    queryFn: async ({ meta }) => {
      invariant(
        activeVault,
        '[useReadWithVaultReport] activeVault is not defined',
      );
      invariant(
        meta?.contracts,
        '[useReadWithVaultReport] contracts are not defined',
      );
      const contracts = meta.contracts as Required<TContracts>;

      return readWithReport({
        publicClient,
        contracts,
        report: activeVault.report,
      });
    },
  });

  return query;
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
  const { activeVault } = useVaultInfo();
  const query = useQuery({
    queryKey: [
      'read-with-report',
      activeVault?.address,
      activeVault?.reportCID,
      functionName,
      args,
    ] as const,
    enabled: !!activeVault && enabled,
    select,
    queryFn: async () => {
      invariant(
        activeVault,
        '[useReadWithVaultReport] activeVault is not defined',
      );

      // @ts-expect-error cannot match types
      const contractData = activeVault.dashboard.encode[functionName](args);

      return readWithReport({
        publicClient,
        contracts: [contractData],
        report: applyReport ? activeVault.report : null,
      }) as Promise<TResult>;
    },
  });

  return query;
};
