import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { zeroAddress } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { useDappStatus } from 'modules/web3';
import { useVault, VAULTS_ROOT_ROLES_MAP } from 'modules/vaults';
import { getConfirmationsInfo } from 'utils/get-confirmations';

import { formatSettingsValues } from '../utils';
import type { MainSettingsFormData, VaultMainSettingsData } from '../types';

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
        feeRate,
        feeRecipient,
        { beaconChainDepositsPauseIntent },
      ] = await Promise.all([
        activeVault.dashboard.read.getRoleMembers([
          VAULTS_ROOT_ROLES_MAP.defaultAdmin,
        ]),
        activeVault.dashboard.read.getRoleMembers([
          VAULTS_ROOT_ROLES_MAP.nodeOperatorManager,
        ]),
        activeVault.dashboard.read.feeRate(),
        activeVault.dashboard.read.feeRecipient(),
        activeVault.hub.read.vaultConnection([activeVault.address]),
      ]);

      const { confirmations, confirmExpiry } = await getConfirmationsInfo(
        activeVault.dashboard.address,
        publicClient,
        dashboard.abi,
      );

      // filter out votes that are already accepted
      const nodeOperatorFeeConfirmations = confirmations.filter(
        ({ decodedData }) =>
          decodedData.functionName === 'setFeeRate' &&
          Number(decodedData.args[0]) !== feeRate,
      );

      const confirmExpiryConfirmations = confirmations.filter(
        ({ decodedData }) =>
          decodedData.functionName === 'setConfirmExpiry' &&
          decodedData.args[0] !== confirmExpiry,
      );

      return {
        defaultAdmins: [...defaultAdmins],
        nodeOperatorManagers: [...nodeOperatorManagers],
        feeRecipient,
        feeRate,
        nodeOperatorFeeConfirmations,
        confirmExpiry,
        confirmExpiryConfirmations,
        isDepositAllowed: !beaconChainDepositsPauseIntent,
      };
    },
  });
};
