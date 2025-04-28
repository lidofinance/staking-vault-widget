import { MutableRefObject, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useVaultInfo } from 'features/overview/contexts';
import { useDappStatus, useLidoSDK } from 'modules/web3';
import { prepareMainTxData } from 'features/settings/main/utils';
import { EditMainSettingsSchema, TxData } from 'features/settings/main/types';
import { dashboardFunctionsNamesMap } from 'features/settings/main/consts';
import { SubmitPayload, SubmitStepEnum } from 'shared/components/submit-modal';
import { getContract, Hash } from 'viem';
import { dashboardAbi } from 'abi/dashboard-abi';

export const useEditMainSettings = () => {
  const {
    core: { web3Provider: walletClient, rpcProvider: publicClient },
  } = useLidoSDK();
  const { address } = useDappStatus();
  const { activeVault } = useVaultInfo();

  const callEditMainSettings = useCallback(
    async (
      payload: EditMainSettingsSchema,
      setModalState: (submitStep: SubmitPayload) => void,
      abortControllerRef: MutableRefObject<AbortController>,
    ) => {
      // TODO: replace by useWriteContracts in future
      const txData = prepareMainTxData(payload);
      const contractAddress = activeVault?.owner;
      invariant(
        contractAddress,
        '[useEditMainSettings] contractAddress is not defined',
      );
      invariant(
        publicClient,
        '[useEditMainSettings] publicClient is not defined',
      );
      invariant(
        walletClient,
        '[useEditMainSettings] walletClient is not defined',
      );
      invariant(address, '[useEditMainSettings] address is not defined');

      const keys = Object.keys(txData) as (keyof TxData)[];
      const contract = getContract({
        address: contractAddress,
        abi: dashboardAbi,
        client: {
          public: publicClient,
          wallet: walletClient,
        },
      });

      const responses: { tx: Hash; key: keyof TxData }[] = [];
      for (const key of keys) {
        const {
          current: { signal },
        } = abortControllerRef;
        if (signal.aborted) {
          return responses;
        }

        const functionName = dashboardFunctionsNamesMap[key];

        setModalState({ step: SubmitStepEnum.confirming });
        // @ts-expect-error find out how to setup right types
        const tx = await contract.write[functionName]({
          address: contractAddress,
          abi: dashboardAbi,
          args: [txData[key]],
        });

        setModalState({ step: SubmitStepEnum.submitting });
        await publicClient.waitForTransactionReceipt({
          hash: tx,
        });

        responses.push({ tx, key });
      }

      return responses;
    },
    [activeVault?.owner, address, publicClient, walletClient],
  );

  return {
    callEditMainSettings,
  };
};

export const useSimulateEditMainSettings = () => {
  const {
    core: { rpcProvider: publicClient },
  } = useLidoSDK();
  const { address } = useDappStatus();
  const { activeVault } = useVaultInfo();

  const simulateEditMainSettings = useCallback(
    async (payload: EditMainSettingsSchema) => {
      const txData = prepareMainTxData(payload);
      const contractAddress = activeVault?.owner;
      invariant(
        contractAddress,
        '[useSimulateEditMainSettings] contractAddress is not defined',
      );
      invariant(
        publicClient,
        '[useSimulateEditMainSettings] publicClient is not defined',
      );
      invariant(
        address,
        '[useSimulateEditMainSettings] address is not defined',
      );

      const keys = Object.keys(txData) as (keyof TxData)[];
      for (const key of keys) {
        const functionName = dashboardFunctionsNamesMap[key];
        await publicClient.simulateContract({
          address: contractAddress,
          abi: dashboardAbi,
          functionName,
          // @ts-expect-error types
          args: [txData[key]],
          account: address,
        });
      }
    },
    [activeVault?.owner, address, publicClient],
  );

  return {
    simulateEditMainSettings,
  };
};
