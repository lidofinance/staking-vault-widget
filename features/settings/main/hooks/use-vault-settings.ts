import { usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { decodeFunctionData, DecodeFunctionDataReturnType } from 'viem';
import invariant from 'tiny-invariant';
import type { Address, Hex } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo, VAULTS_ROOT_ROLES_MAP } from 'modules/vaults';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';

const AVG_BLOCK_TIME_SEC = 12n;

type DecodedData = DecodeFunctionDataReturnType<
  typeof dashboardAbi,
  'setConfirmExpiry' | 'setNodeOperatorFeeRate'
>;

type ConfirmationsInfo = {
  member: Address;
  role: Hex;
  expiryTimestamp: bigint;
  expiryDate: Date;
  data: Hex;
  decodedData: DecodedData;
};
export type VaultSettings = {
  defaultAdmins: readonly Address[];
  nodeOperatorManagers: readonly Address[];
  nodeOperatorFeeRate: bigint;
  confirmExpiry: bigint;
  nodeOperatorFeeRecipient: Address;
  confirmations: ConfirmationsInfo[];
};

export const useVaultSettings = () => {
  const publicClient = usePublicClient();
  const { activeVault } = useVaultInfo();

  return useQuery<VaultSettings>({
    queryKey: [
      'confirmations-info',
      activeVault?.owner,
      publicClient?.chain.id,
    ],
    ...STRATEGY_LAZY,
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, '[useConfirmationsInfo] owner is not defined');

      const [
        defaultAdmins,
        nodeOperatorManagers,
        nodeOperatorFeeRate,
        confirmExpiry,
        nodeOperatorFeeRecipient,
      ] = await Promise.all([
        activeVault.dashboard.read.getRoleMembers([
          VAULTS_ROOT_ROLES_MAP.defaultAdmin,
        ]),
        activeVault.dashboard.read.getRoleMembers([
          VAULTS_ROOT_ROLES_MAP.nodeOperatorManager,
        ]),
        activeVault.dashboard.read.nodeOperatorFeeRate(),
        activeVault.dashboard.read.getConfirmExpiry(),
        activeVault.dashboard.read.nodeOperatorFeeRecipient(),
      ]);

      const currentBlock = await publicClient.getBlockNumber();
      const confirmExpireInBlocks = confirmExpiry / AVG_BLOCK_TIME_SEC;
      const fromBlock = currentBlock - confirmExpireInBlocks;

      const logs = await activeVault.dashboard.getEvents.RoleMemberConfirmed(
        undefined,
        {
          fromBlock,
          toBlock: currentBlock,
          strict: true,
        },
      );

      const dataObject: Record<Hex, ConfirmationsInfo> = logs
        .filter(
          ({ args }) =>
            Number(args.expiryTimestamp) * 1000 - new Date().getTime() > 0, // TODO: upgrade to when we will have block time new Date().getTime() / 1000 - log.block.time <= activeVault.confirmExpiry
        )
        .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber))
        .reduce<Record<Hex, ConfirmationsInfo>>((acc, log) => {
          const args = log.args as Required<typeof log.args>;

          const decoded = decodeFunctionData({
            abi: dashboardAbi,
            data: args.data,
          }) as DecodedData;

          if (
            args.confirmTimestamp + confirmExpiry >
            BigInt(Date.now()) / 1000n
          ) {
            acc[args.data] = {
              member: args.member,
              role: args.role,
              expiryTimestamp: args.expiryTimestamp,
              expiryDate: new Date(Number(args.expiryTimestamp) * 1000),
              data: args.data,
              decodedData: decoded,
            };
          }

          return acc;
        }, {});

      const confirmations = await publicClient.multicall({
        allowFailure: false,
        contracts: Object.entries(dataObject).map(([data, log]) =>
          activeVault.dashboard.encode.confirmation([data as Hex, log.role]),
        ),
      });
      return {
        defaultAdmins,
        nodeOperatorManagers,
        nodeOperatorFeeRate,
        confirmExpiry,
        nodeOperatorFeeRecipient,
        confirmations: Object.entries(dataObject)
          .map(([_, log], index) => ({
            ...log,
            confirmations: confirmations[index],
          }))
          .filter((vote) => vote.confirmations > 0n),
      };
    },
  });
};
