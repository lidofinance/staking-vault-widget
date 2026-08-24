import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import type {
  ContractFunctionName,
  ContractFunctionArgs,
  ContractFunctionReturnType,
} from 'viem';

import { useLidoSDK } from 'modules/web3';

import { readWithReport } from '../report';
import { useVault } from '../vault-context';
import { VaultDisconnectedError } from '../consts';

import type { DashboardAbiType } from '@lidofinance/lido-ethereum-sdk/stvault';

export const useReadDashboard = <
  TMutability extends 'pure' | 'view' | 'nonpayable' | 'payable',
  TFunctionName extends ContractFunctionName<
    DashboardAbiType,
    TMutability
  > = ContractFunctionName<DashboardAbiType, TMutability>,
  TArgs extends ContractFunctionArgs<
    DashboardAbiType,
    TMutability,
    TFunctionName
  > = ContractFunctionArgs<DashboardAbiType, TMutability, TFunctionName>,
  TResult extends ContractFunctionReturnType<
    DashboardAbiType,
    TMutability,
    TFunctionName
  > = ContractFunctionReturnType<DashboardAbiType, TMutability, TFunctionName>,
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
      { args, functionName },
    ] as const,
    enabled: !!activeVault && enabled,
    select,
    queryFn: async ({ queryKey }) => {
      const { args, functionName } = queryKey[5];
      invariant(
        activeVault,
        '[useReadWithVaultReport] activeVault is not defined',
      );

      // a fully disconnected vault's dashboard address no longer points to
      // a valid Dashboard contract, so any read against it would revert
      if (activeVault.isVaultFullDisconnected) {
        throw new VaultDisconnectedError();
      }

      // @ts-expect-error cannot match types
      const contractData = activeVault.dashboard.prepare[functionName](args);

      return (
        await readWithReport({
          publicClient,
          lazyOracle: activeVault.lazyOracle,
          contracts: [contractData],
          report: applyReport ? activeVault.report : null,
          isReportFresh: activeVault.isReportFresh,
        })
      )[0];
    },
  });

  return query;
};
