import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import { useLidoSDK, useSendTransaction, withSuccess } from 'modules/web3';
import {
  getStEthContract,
  useReportCalls,
  useVault,
  vaultTexts,
} from 'modules/vaults';
import { GoToVault } from 'modules/vaults/components/go-to-vault';

import { useMintData } from './use-mint-data';
import type { MintFormValidatedValues } from '../types';

export const useMint = () => {
  const { activeVault } = useVault();
  const { publicClient } = useLidoSDK();
  const prepareReportCalls = useReportCalls();
  const { mintableQuery } = useMintData();
  const { sendTX, ...rest } = useSendTransaction();
  const maxMintableShares = mintableQuery.data?.maxMintableShares;

  return {
    mint: useCallback(
      async ({ amount, recipient, token }: MintFormValidatedValues) => {
        invariant(activeVault, '[useMint] activeVault is undefined');
        invariant(publicClient, '[useMint] publicClient is undefined');
        invariant(
          maxMintableShares,
          '[useMint] maxMintableShares is undefined',
        );

        const stethContract = getStEthContract(publicClient);
        const loadingActionText = vaultTexts.actions.mint.loading(token);
        const mainActionCompleteText = vaultTexts.actions.mint.completed(token);

        let txAmount = amount;
        if (token === 'stETH') {
          const sharesAmount = await stethContract.read.getSharesByPooledEth([
            amount,
          ]);
          const diff = maxMintableShares - sharesAmount;
          txAmount = diff === 1n ? sharesAmount + 1n : sharesAmount;
        }

        const mintCall = {
          ...activeVault.dashboard.encode[
            token === 'stETH' ? 'mintShares' : 'mintWstETH'
          ]([recipient, txAmount]),
          loadingActionText,
        };

        const { success } = await withSuccess(
          sendTX({
            transactions: async () => [...prepareReportCalls(), mintCall],
            forceAtomic: true,
            mainActionLoadingText: loadingActionText,
            mainActionCompleteText,
            renderSuccessContent: GoToVault,
          }),
        );

        return success;
      },
      [
        activeVault,
        prepareReportCalls,
        sendTX,
        publicClient,
        maxMintableShares,
      ],
    ),
    ...rest,
  };
};
