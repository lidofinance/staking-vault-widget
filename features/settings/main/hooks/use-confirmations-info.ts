import { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import {
  decodeFunctionData,
  DecodeFunctionDataReturnType,
  parseAbiItem,
} from 'viem';
import type { Address, Hex } from 'viem';
import { dashboardAbi } from 'abi/dashboard-abi';
import invariant from 'tiny-invariant';
import { useVaultInfo } from 'modules/vaults';

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
  const [data, setLogsData] = useState<LogsData | undefined>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfirmationsInfo = useCallback(async () => {
    invariant(
      publicClient,
      '[useConfirmationsInfo] publicClient is not defined',
    );
    const dashboardAddress = activeVault?.owner;
    const confirmExpiry = activeVault?.confirmExpiry;

    if (!dashboardAddress || !confirmExpiry) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
      });

      const dataObject: LogsData = logs
        .map((log) => log.args)
        .filter(
          (
            args,
          ): args is {
            member: Address;
            role: Hex;
            expiryTimestamp: bigint;
            data: Hex;
          } =>
            Boolean(
              args.member && args.role && args.expiryTimestamp && args.data,
            ),
        )
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

      const votings = await Promise.all(
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

      const filteredVotingList = votings.filter(
        (voting) => voting !== null,
      ) as LogsData;
      setLogsData(filteredVotingList);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [activeVault, publicClient]);

  useEffect(() => {
    void fetchConfirmationsInfo();
  }, [fetchConfirmationsInfo]);

  return { data, isLoading, error, refetch: fetchConfirmationsInfo };
};
