import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import type {
  ContractFunctionName,
  ContractFunctionArgs,
  ContractFunctionReturnType,
  ContractFunctionParameters,
} from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useLidoSDK } from 'modules/web3';
import { isBigint } from 'utils';

import { readWithReport } from '../report';
import { useVault } from '../vault-context';

const stringifyArgs = (args: unknown): string => {
  return JSON.stringify(args ?? [], (_, value) =>
    isBigint(value) ? value.toString() : value,
  );
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
      { args: stringifyArgs(args) },
    ] as const,
    enabled: !!activeVault && enabled,
    select,
    queryFn: async () => {
      invariant(
        activeVault,
        '[useReadWithVaultReport] activeVault is not defined',
      );

      const prepare = activeVault.dashboard.prepare as Record<
        TFunctionName,
        (args: TArgs | undefined) => ContractFunctionParameters
      >;
      const contractData = prepare[functionName](args);

      return (
        await readWithReport({
          publicClient,
          lazyOracle: activeVault.lazyOracle,
          contracts: [contractData],
          report: applyReport ? activeVault.report : null,
          isReportFresh: activeVault.isReportFresh,
        })
      )[0] as TResult;
    },
  });

  return query;
};
