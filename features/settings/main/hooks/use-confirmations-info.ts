import { usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import {
  decodeFunctionData,
  DecodeFunctionDataReturnType,
  parseAbiItem,
} from 'viem';
import invariant from 'tiny-invariant';
import type { Address, Hex } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo } from 'modules/vaults';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';

const AVG_BLOCK_TIME_SEC = 12n;

type FunctionName = 'setConfirmExpiry' | 'setNodeOperatorFeeBP';

type DecodedData = DecodeFunctionDataReturnType<
  typeof dashboardAbi,
  FunctionName
>;

type ConfirmationsInfo = {
  member: Address;
  role: Hex;
  expiryTimestamp: bigint;
  expiryDate: Date;
  data: Hex;
  decodedData: DecodedData;
};
export type LogsData = ConfirmationsInfo[];

export const useConfirmationsInfo = () => {
  const publicClient = usePublicClient();
  const { activeVault } = useVaultInfo();

  return useQuery<LogsData>({
    queryKey: [
      'confirmations-info',
      activeVault?.owner,
      publicClient?.chain.id,
    ],
    ...STRATEGY_LAZY,
    enabled: !!activeVault?.owner && !!publicClient?.chain.id,
    queryFn: async () => {
      invariant(
        publicClient,
        '[useConfirmationsInfo] publicClient is not defined',
      );
      invariant(
        activeVault?.owner,
        '[useConfirmationsInfo] owner is not defined',
      );

      const dashboardAddress = activeVault?.owner;
      const confirmExpiry = activeVault?.confirmExpiry;

      const currentBlock = await publicClient.getBlockNumber();
      const confirmExpireInBlocks = confirmExpiry / AVG_BLOCK_TIME_SEC;
      const fromBlock = currentBlock - confirmExpireInBlocks;

      const logs = await publicClient.getLogs({
        address: dashboardAddress,
        event: parseAbiItem(
          'event RoleMemberConfirmed(address indexed member, bytes32 indexed role, uint256 expiryTimestamp, bytes data)',
        ),
        fromBlock,
        toBlock: currentBlock,
        strict: true,
      });

      const dataObject: LogsData = logs
        .map((log) => log.args)
        .sort((a, b) => Number(a.expiryTimestamp - b.expiryTimestamp))
        .reduce<LogsData>((acc, args) => {
          const decoded = decodeFunctionData({
            abi: dashboardAbi,
            data: args.data,
          });

          acc.push({
            member: args.member,
            role: args.role,
            expiryTimestamp: args.expiryTimestamp,
            expiryDate: new Date(Number(args.expiryTimestamp) * 1000),
            data: args.data,
            // @ts-expect-error list of decoded types is not compatible to functions: FunctionName
            decodedData: decoded,
          });
          return acc;
        }, []);

      const voting = await Promise.all(
        dataObject.map(async (log) => {
          const { role, data } = log;
          const confirmations = await publicClient.readContract({
            address: dashboardAddress,
            abi: dashboardAbi,
            functionName: 'confirmations',
            args: [data, role],
          });

          if (confirmations === 0n) return null;
          return log;
        }),
      );

      return voting.filter((vote) => vote !== null) as LogsData;
    },
  });
};
