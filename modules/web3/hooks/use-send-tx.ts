import {
  hexToBigInt,
  type Address,
  type Hex,
  type TransactionReceipt,
  type WaitForCallsStatusReturnType,
  type WalletCallReceipt,
} from 'viem';

import { useMutation } from '@tanstack/react-query';
import { useAA } from './use-aa';

import { useTransactionModal } from 'shared/components/transaction-modal';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import invariant from 'tiny-invariant';
import { TransactionModalState } from 'shared/components/transaction-modal/types';
import {
  DisplayableError,
  SendTxGetStatusError,
  useVault,
} from 'modules/vaults';
import { useAddressValidation } from 'providers/address-validation-provider';
import { useDappStatus, useLidoSDK } from 'modules/web3';
import {
  AA_TX_POLLING_TIMEOUT,
  TX_BLOCK_CONFIRMATIONS,
} from 'config/groups/web3';
import { useCallback } from 'react';

export type TransactionEntry = {
  to: Address;
  data: Hex;
  value?: bigint;
  loadingActionText?: string;
  baseDescriptionText?: string;
  awaitingDescriptionText?: string;
};

export type SendTransactionArguments = {
  transactions: TransactionEntry[] | (() => Promise<TransactionEntry[]>);
  mainActionLoadingText: string;
  mainActionCompleteText: string;
  mainActionCompleteDescriptionText?: string;
  forceAtomic?: boolean;
  forceLegacy?: boolean;
  allowRetry?: boolean;
} & Pick<TransactionModalState['details'], 'renderSuccessContent'>;

// TODO: wrapper around error with readable message
type TransactionError = Error;

export type TransactionResponse = {
  lastTxBlock: bigint;
  receipts: TransactionReceipt[];
} & (
  | {
      isAA: true;
      callStatus: WaitForCallsStatusReturnType;
    }
  | {
      isAA: false;
      callStatus?: undefined;
    }
);

const receiptsToLastBlock = (
  receipts: (
    | TransactionReceipt
    | WalletCallReceipt<bigint, 'success' | 'reverted'>
  )[],
): bigint => {
  const lastTxBlock = receipts
    .map((receipt) =>
      typeof receipt.blockNumber === 'bigint'
        ? receipt.blockNumber
        : hexToBigInt(receipt.blockNumber),
    )
    .sort((a, b) => (a < b ? 1 : -1))
    .at(-1);
  return lastTxBlock ?? 0n;
};

export const useSendTransaction = () => {
  const { setLatestTxBlock } = useVault();
  const { publicClient, walletClient } = useLidoSDK();
  const { address } = useDappStatus();
  const { dispatchModal } = useTransactionModal();
  const { retryEvent, retryFire } = useFormControllerRetry();
  const { validateAddress } = useAddressValidation();
  const { isAA } = useAA();

  const mutationFn = useCallback(
    async ({
      transactions,
      mainActionCompleteText,
      mainActionLoadingText,
      mainActionCompleteDescriptionText,
      forceAtomic,
      forceLegacy,
      allowRetry = true,
      renderSuccessContent,
    }: SendTransactionArguments): Promise<TransactionResponse> => {
      const receipts: TransactionReceipt[] = [];
      const useSendCalls = !forceLegacy && isAA;

      try {
        const validationResult = await validateAddress(address);
        // if address is not valid, don't send the transaction
        if (!validationResult) {
          throw new Error('Validation failed');
        }

        if (!publicClient || !walletClient) {
          throw new Error('Public or wallet client is not initialized');
        }

        dispatchModal({
          type: 'init',
          isBatch: useSendCalls,
          isOpen: false,
          stage: 'none',
          onRetry: allowRetry ? retryFire : undefined,
          details: {
            actionCompleteText: mainActionCompleteText,
            mainActionCompleteDescriptionText:
              mainActionCompleteDescriptionText,
            actionLoadingText: mainActionLoadingText,
            renderSuccessContent,
          },
        });

        // Optionally callback can be provided if some tx prep is async
        if (typeof transactions === 'function') {
          dispatchModal({
            type: 'stage',
            stage: 'collecting',
          });

          transactions = await transactions();
        }

        invariant(
          transactions.length > 0,
          '[useSendTransaction] No transactions provided',
        );

        if (useSendCalls) {
          const calls = transactions.map((tx) => ({
            to: tx.to,
            data: tx.data,
            value: tx.value,
          }));

          // For AA we display single modal with general action text
          dispatchModal({
            type: 'stage',
            stage: 'signing',
            details: {
              actionCompleteText: mainActionCompleteText,
              mainActionCompleteDescriptionText:
                mainActionCompleteDescriptionText,
              actionLoadingText: mainActionLoadingText,
            },
          });

          const { id } = await walletClient.sendCalls({
            calls,
            forceAtomic,
            experimental_fallback: true,
          });

          dispatchModal({
            type: 'stage',
            stage: 'awaiting',
            details: {
              transactionId: id,
            },
          });

          // special handling when we were unable to get status
          // tx status is ambiguous in this case
          let callStatus: WaitForCallsStatusReturnType;
          try {
            callStatus = await walletClient.waitForCallsStatus({
              id,
              timeout: AA_TX_POLLING_TIMEOUT,
            });
          } catch (error) {
            throw new SendTxGetStatusError(error);
          }

          // TODO: async check if user want to retry with legacy flow
          if (callStatus.status === 'failure') {
            throw new Error('Batch failed');
          }

          let receipts: TransactionReceipt[] = [];

          if (callStatus.receipts && callStatus.receipts.length > 0) {
            const latestReceipt =
              callStatus.receipts[callStatus.receipts.length - 1];

            const receipt = await publicClient.waitForTransactionReceipt({
              hash: latestReceipt.transactionHash,
              confirmations: TX_BLOCK_CONFIRMATIONS,
              timeout: AA_TX_POLLING_TIMEOUT,
            });

            receipts = [receipt];
          }

          const transactionResult = {
            isAA,
            callStatus,
            receipts,
            lastTxBlock: receiptsToLastBlock(receipts),
          };

          dispatchModal({
            type: 'stage',
            stage: 'success',
            details: {
              transactionResult,
            },
          });

          setLatestTxBlock(transactionResult.lastTxBlock);

          return transactionResult;
        }

        for (const tx of transactions) {
          // display each transaction text modal
          dispatchModal({
            type: 'stage',
            stage: 'signing',
            details: {
              actionLoadingText: tx.loadingActionText ?? mainActionLoadingText,
              baseDescriptionText: tx.baseDescriptionText,
            },
          });

          const gas = await publicClient.estimateGas({
            to: tx.to,
            data: tx.data,
            value: tx.value,
            account: address,
          });

          const txHash = await walletClient.sendTransaction({
            to: tx.to,
            data: tx.data,
            value: tx.value,
            gas,
          });

          dispatchModal({
            type: 'stage',
            stage: 'awaiting',
            details: {
              transactionId: txHash,
              awaitingDescriptionText: tx.awaitingDescriptionText,
            },
          });

          const txReceipt = await publicClient.waitForTransactionReceipt({
            hash: txHash,
            confirmations: TX_BLOCK_CONFIRMATIONS,
          });

          receipts.push(txReceipt);

          if (txReceipt.status !== 'success') {
            throw new Error('Transaction failed');
          }
        }

        const transactionResult = {
          isAA: useSendCalls,
          receipts,
          lastTxBlock: receiptsToLastBlock(receipts),
        };

        dispatchModal({
          type: 'stage',
          stage: 'success',
          details: {
            transactionResult,
          },
        });

        setLatestTxBlock(transactionResult.lastTxBlock);

        return transactionResult;
      } catch (error) {
        const displayError =
          error instanceof DisplayableError ? error : undefined;
        dispatchModal({
          type: 'stage',
          stage: 'error',
          allowRetry: displayError?.isRetryable,
          details: {
            errorText: displayError?.message,
            errorTitle: displayError?.errorTitle,
          },
        });
        console.error(`[useSendTransaction] TX Error`, error);
        throw error;
      }
    },
    [
      address,
      dispatchModal,
      isAA,
      publicClient,
      retryFire,
      setLatestTxBlock,
      validateAddress,
      walletClient,
    ],
  );

  const mutation = useMutation<
    TransactionResponse,
    TransactionError,
    SendTransactionArguments
  >({
    mutationKey: ['sendTransaction', isAA, retryFire],
    mutationFn,
  });

  return {
    mutation,
    sendTX: mutation.mutateAsync,
    retryEvent,
    retryFire,
  };
};

export const withSuccess = <T>(
  promise: Promise<T>,
): Promise<
  | { success: true; result: T; error?: undefined }
  | { success: false; result?: undefined; error: unknown }
> =>
  promise.then(
    (res) => ({
      success: true,
      result: res,
    }),
    (error) => ({
      success: false,
      error,
    }),
  );
