import type {
  Address,
  Hex,
  TransactionReceipt,
  WaitForCallsStatusReturnType,
} from 'viem';

import { useMutation } from '@tanstack/react-query';
import { useConfig } from 'wagmi';
import { useAA } from './use-aa';

// @wagmi/core provides async wagmi actions
// avoid putting it in main dependencies as it will eventually conflict with wagmi package
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  waitForCallsStatus,
  sendCalls,
  sendTransaction,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { useTransactionModalContext } from 'shared/components/transaction-modal';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';

export type TransactionEntry = {
  to: Address;
  data: Hex;
  value?: bigint;
  loadingActionText?: string;
};

type SendTransactionArguments = {
  transactions: TransactionEntry[];
  mainActionLoadingText: string;
  mainActionCompleteText: string;
  forceAtomic?: boolean;
  forceLegacy?: boolean;
};

// TODO: wrapper around error with readable message
type TransactionError = Error;

type TransactionResponse =
  | {
      isAA: true;
      callStatus: WaitForCallsStatusReturnType;
      receipts: TransactionReceipt[];
    }
  | {
      isAA: false;
      callStatus?: undefined;
      receipts: TransactionReceipt[];
    };

export const useSendTransaction = () => {
  const config = useConfig();
  const { dispatchModal } = useTransactionModalContext();
  const { retryEvent, retryFire } = useFormControllerRetry();
  const { isAA } = useAA();

  const mutation = useMutation<
    TransactionResponse,
    TransactionError,
    SendTransactionArguments
  >({
    mutationKey: ['sendTransaction'],

    mutationFn: async ({
      transactions,
      mainActionCompleteText,
      mainActionLoadingText,
      forceAtomic,
      forceLegacy,
    }) => {
      const receipts: TransactionReceipt[] = [];
      const useSendCalls = !!forceLegacy && isAA;
      try {
        dispatchModal({
          type: 'init',
          isBatch: useSendCalls,
          isOpen: false,
          stage: 'none',
          onRetry: retryFire,
        });

        if (useSendCalls) {
          const calls = transactions.map((tx) => ({
            to: tx.to,
            data: tx.data,
            value: tx.value,
            f,
          }));

          // For AA we display single modal with general action text
          dispatchModal({
            type: 'stage',
            stage: 'signing',
            details: {
              actionCompleteText: mainActionCompleteText,
              actionLoadingText: mainActionLoadingText,
            },
          });

          const { id } = await sendCalls(config, { calls, forceAtomic });

          dispatchModal({
            type: 'stage',
            stage: 'awaiting',
            details: {
              transactionId: id,
            },
          });

          const callStatus = await waitForCallsStatus(config, { id });

          // TODO: async check if user want to retry with legacy flow
          if (callStatus.status === 'failure') {
            throw new Error('Batch failed');
          }

          dispatchModal({
            type: 'stage',
            stage: 'success',
          });

          return {
            isAA,
            callStatus,
            receipts: callStatus.receipts,
          } as TransactionResponse;
        }

        for (const tx of transactions) {
          // display each transaction text modal
          dispatchModal({
            type: 'stage',
            stage: 'signing',
            details: {
              actionCompleteText:
                tx.loadingActionText ?? mainActionCompleteText,
              actionLoadingText: tx.loadingActionText ?? mainActionLoadingText,
            },
          });

          const txHash = await sendTransaction(config, {
            to: tx.to,
            data: tx.data,
            value: tx.value,
          });

          dispatchModal({
            type: 'stage',
            stage: 'awaiting',
            details: {
              transactionId: txHash,
            },
          });
          const txReceipt = await waitForTransactionReceipt(config, {
            hash: txHash,
            confirmations: 1,
          });

          receipts.push(txReceipt);

          if (txReceipt.status !== 'success') {
            throw new Error('Transaction failed');
          }
        }

        dispatchModal({
          type: 'stage',
          stage: 'success',
        });
      } catch (error) {
        dispatchModal({ type: 'stage', stage: 'error' });
        console.error(`[useSendTransaction] TX Error`, error);
        throw error;
      }

      return { isAA: useSendCalls, receipts };
    },
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
