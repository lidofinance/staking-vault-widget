import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useVaultInfo } from 'features/overview/contexts';
import { useAA, useDappStatus, useLidoSDK, useSendAACalls } from 'modules/web3';
import { generateMainAATxData, prepareMainTxData } from '../utils';
import { EditMainSettingsSchema } from '../types';
import { sendDashboardTx } from 'utils/send-dashboard-tx';

export const useEditMainSettings = (onMutate = async () => {}) => {
  const {
    core: { web3Provider: walletClient, rpcProvider: publicClient },
  } = useLidoSDK();
  const { address } = useDappStatus();
  const { activeVault } = useVaultInfo();
  const sendAACalls = useSendAACalls();
  const { isAA } = useAA();

  // TODO: add opportunity to get receipts
  const callEditMainSettings = useCallback(
    async (payload: EditMainSettingsSchema) => {
      // TODO: replace by useWriteContracts in future
      const txData = prepareMainTxData(payload);
      const contractAddress = activeVault?.owner;
      invariant(contractAddress);
      invariant(publicClient);
      invariant(walletClient);
      invariant(address);

      if (isAA) {
        const data = await generateMainAATxData({
          txData,
          publicClient,
          address: contractAddress,
          account: address,
        });

        await sendAACalls(data, onMutate);
      } else {
        return await sendDashboardTx({
          txData,
          publicClient,
          walletClient,
          contractAddress,
        });
      }
    },
    [
      activeVault?.owner,
      address,
      publicClient,
      walletClient,
      isAA,
      sendAACalls,
      onMutate,
    ],
  );

  return {
    callEditMainSettings,
  };
};
