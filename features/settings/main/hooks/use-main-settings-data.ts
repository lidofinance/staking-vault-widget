import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { decodeFunctionData, zeroAddress } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { useDappStatus } from 'modules/web3';
import { useVault, VAULTS_ROOT_ROLES_MAP } from 'modules/vaults';
import { formatSettingsValues } from '../utils';
import type { MainSettingsFormData, VaultMainSettingsData } from '../types';

const AVG_BLOCK_TIME_SEC = 12n;

export const useVaultSettingsData = () => {
  const publicClient = usePublicClient();
  const { address } = useDappStatus();
  const { activeVault, queryKeys } = useVault();

  const select = useCallback(
    (data: VaultMainSettingsData) => {
      return formatSettingsValues(data, address ?? zeroAddress);
    },
    [address],
  );

  return useQuery<VaultMainSettingsData, Error, MainSettingsFormData>({
    queryKey: [...queryKeys.config(), 'vault-main-settings'],
    enabled: !!activeVault,
    select,
    queryFn: async (): Promise<VaultMainSettingsData> => {
      invariant(activeVault, '[useConfirmationsInfo] owner is not defined');

      const dashboard = activeVault.dashboard;

      const [
        defaultAdmins,
        nodeOperatorManagers,
        nodeOperatorFeeRate,
        confirmExpiry,
        nodeOperatorFeeRecipient,
        currentBlock,
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
        publicClient.getBlockNumber(),
      ]);

      const confirmExpireInBlocks = confirmExpiry / AVG_BLOCK_TIME_SEC;
      const fromBlock = currentBlock - confirmExpireInBlocks;

      // TODO: move confirmations fetching to separate util
      const logs = await activeVault.dashboard.getEvents.RoleMemberConfirmed(
        {
          role: [
            VAULTS_ROOT_ROLES_MAP.defaultAdmin,
            VAULTS_ROOT_ROLES_MAP.nodeOperatorManager,
          ] as const,
        },
        {
          strict: true,
          fromBlock,
          toBlock: currentBlock,
        },
      );

      let confirmations = logs
        // filter out confirmations that are already expired
        .filter(
          ({ args }) =>
            args.confirmTimestamp &&
            args.confirmTimestamp + confirmExpiry > BigInt(Date.now()) / 1000n,
        )
        .map((log) => {
          const { confirmTimestamp, member, role, data } = log.args as Required<
            typeof log.args
          >;
          const expiryTimestamp = confirmTimestamp + confirmExpiry;

          return {
            member,
            role,
            expiryTimestamp,
            expiryDate: new Date(Number(expiryTimestamp) * 1000),
            data,
            decodedData: decodeFunctionData({
              abi: dashboard.abi,
              data: data,
            }) as VaultMainSettingsData['confirmExpiryConfirmations'][number]['decodedData'],
          };
        });

      const dedupedMap = confirmations.reduce((dataMap, confirmation) => {
        const entry = dataMap.get(confirmation.data);

        if (!entry || entry.expiryTimestamp < confirmation.expiryTimestamp) {
          dataMap.set(confirmation.data, confirmation);
        }

        return dataMap;
      }, new Map<string, (typeof confirmations)[number]>());

      confirmations = [...dedupedMap.values()].sort((a, b) =>
        Number(a.expiryTimestamp - b.expiryTimestamp),
      );

      // filter out votes that are already accepted
      const nodeOperatorFeeConfirmations = confirmations.filter(
        ({ decodedData }) =>
          decodedData.functionName === 'setNodeOperatorFeeRate' &&
          decodedData.args[0] !== nodeOperatorFeeRate,
      );

      const confirmExpiryConfirmations = confirmations.filter(
        ({ decodedData }) =>
          decodedData.functionName === 'setConfirmExpiry' &&
          decodedData.args[0] !== confirmExpiry,
      );

      return {
        defaultAdmins: [...defaultAdmins],
        nodeOperatorManagers: [...nodeOperatorManagers],
        nodeOperatorFeeRecipient,
        nodeOperatorFeeRate,
        nodeOperatorFeeConfirmations,
        confirmExpiry,
        confirmExpiryConfirmations,
      };
    },
  });
};
