import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { zeroAddress } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { useDappStatus, useLidoSDK } from 'modules/web3';
import {
  useVault,
  VAULTS_ROOT_ROLES_MAP,
  VAULT_REPORT_REFETCH_INTERVAL_MS,
} from 'modules/vaults';
import { getConfirmationsInfo } from 'utils/get-confirmations';
import { awaitWithTimeout } from 'utils/await-with-timeout';
import { waitForRpcBlock } from 'utils/wait-for-rpc-block';

import { formatSettingsValues } from '../utils';
import type { MainSettingsFormData, VaultMainSettingsData } from '../types';

export const useVaultSettingsData = () => {
  const publicClient = usePublicClient();
  const { address } = useDappStatus();
  const { activeVault, queryKeys } = useVault();
  const { getLatestTxBlock } = useLidoSDK();

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

      // wait for RPC to reach the latest tx block and read at it,
      // so data after partial success of legacy batch includes applied txs
      const blockNumber = await awaitWithTimeout(
        waitForRpcBlock(publicClient, getLatestTxBlock() ?? 0n),
        VAULT_REPORT_REFETCH_INTERVAL_MS,
      );
      const callOptions = { blockNumber };

      const [
        defaultAdmins,
        nodeOperatorManagers,
        feeRate,
        feeRecipient,
        pdgPolicy,
        { beaconChainDepositsPauseIntent },
      ] = await Promise.all([
        dashboard.read.getRoleMembers(
          [VAULTS_ROOT_ROLES_MAP.defaultAdmin],
          callOptions,
        ),
        dashboard.read.getRoleMembers(
          [VAULTS_ROOT_ROLES_MAP.nodeOperatorManager],
          callOptions,
        ),
        dashboard.read.feeRate(callOptions),
        dashboard.read.feeRecipient(callOptions),
        dashboard.read.pdgPolicy(callOptions),
        activeVault.hub.read.vaultConnection(
          [activeVault.address],
          callOptions,
        ),
      ]);

      const { confirmations, confirmExpiry } = await getConfirmationsInfo(
        dashboard.address,
        publicClient,
        dashboard.abi,
        blockNumber,
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
        pdgPolicy: String(pdgPolicy),
        blockNumber,
      };
    },
  });
};
