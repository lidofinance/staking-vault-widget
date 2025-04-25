import { MutableRefObject, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useVaultInfo } from 'features/overview/contexts';
import { useDappStatus, useLidoSDK } from 'modules/web3';
import { prepareMainTxData } from 'features/settings/main/utils';
import { EditMainSettingsSchema } from 'features/settings/main/types';
import { sendDashboardTx } from 'utils/send-dashboard-tx';
import { SubmitPayload, SubmitStepEnum } from 'shared/components/submit-modal';

export const useEditMainSettings = () => {
  const {
    core: { web3Provider: walletClient, rpcProvider: publicClient },
  } = useLidoSDK();
  const { address } = useDappStatus();
  const { activeVault, refetch } = useVaultInfo();

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

      setModalState({ step: SubmitStepEnum.confirming });
      const response = await sendDashboardTx({
        txData,
        publicClient,
        walletClient,
        contractAddress,
        abortControllerRef,
      });

      setModalState({ step: SubmitStepEnum.submitting });
      await Promise.all(
        response.map(async ({ tx }) => {
          await publicClient.waitForTransactionReceipt({
            hash: tx,
          });
        }),
      );

      refetch();
      return response;
    },
    [activeVault?.owner, address, publicClient, walletClient, refetch],
  );

  return {
    callEditMainSettings,
  };
};
