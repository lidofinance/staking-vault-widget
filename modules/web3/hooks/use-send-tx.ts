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
import { useTransactionModal } from 'shared/components/transaction-modal';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import invariant from 'tiny-invariant';
import { TransactionModalState } from 'shared/components/transaction-modal/types';
import { DisplayableError } from 'modules/vaults';

export type TransactionEntry = {
  to: Address;
  data: Hex;
  value?: bigint;
  loadingActionText?: string;
};

export type SendTransactionArguments = {
  transactions: TransactionEntry[] | (() => Promise<TransactionEntry[]>);
  mainActionLoadingText: string;
  mainActionCompleteText: string;
  forceAtomic?: boolean;
  forceLegacy?: boolean;
  allowRetry?: boolean;
} & Pick<TransactionModalState['details'], 'renderSuccessContent'>;

// TODO: wrapper around error with readable message
type TransactionError = Error;

export type TransactionResponse =
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
  const { dispatchModal } = useTransactionModal();
  const { retryEvent, retryFire } = useFormControllerRetry();
  const { isAA } = useAA();

  const mutation = useMutation<
    TransactionResponse,
    TransactionError,
    SendTransactionArguments
  >({
    mutationKey: ['sendTransaction', isAA, retryFire],
    mutationFn: async ({
      transactions,
      mainActionCompleteText,
      mainActionLoadingText,
      forceAtomic,
      forceLegacy,
      allowRetry = true,
      renderSuccessContent,
    }) => {
      const receipts: TransactionReceipt[] = [];
      const useSendCalls = !forceLegacy && isAA;

      try {
        dispatchModal({
          type: 'init',
          isBatch: useSendCalls,
          isOpen: false,
          stage: 'none',
          onRetry: allowRetry ? retryFire : undefined,
          details: {
            actionCompleteText: mainActionCompleteText,
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

          const transactionResult = {
            isAA,
            callStatus,
            receipts: callStatus.receipts,
          } as TransactionResponse;

          dispatchModal({
            type: 'stage',
            stage: 'success',
            details: {
              transactionResult,
            },
          });

          return transactionResult;
        }

        for (const tx of transactions) {
          // display each transaction text modal
          dispatchModal({
            type: 'stage',
            stage: 'signing',
            details: {
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

        const transactionResult = { isAA: useSendCalls, receipts };

        dispatchModal({
          type: 'stage',
          stage: 'success',
          details: { transactionResult },
        });

        return transactionResult;
      } catch (error) {
        const errorText =
          error instanceof DisplayableError ? error.message : undefined;
        dispatchModal({
          type: 'stage',
          stage: 'error',
          details: { errorText },
        });
        console.error(`[useSendTransaction] TX Error`, error);
        throw error;
      }
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
