import { useCallback, useEffect, useRef, useState } from 'react';
import {
  hexToBigInt,
  type Address,
  type Hex,
  type TransactionReceipt,
  type WaitForCallsStatusReturnType,
  type WalletCallReceipt,
} from 'viem';
import invariant from 'tiny-invariant';
import { useMutation } from '@tanstack/react-query';

import {
  DisplayableError,
  SendTxGetStatusError,
  vaultTexts,
} from 'modules/vaults';
import { useDappStatus, useLidoSDK } from 'modules/web3';
import {
  AA_TX_POLLING_TIMEOUT,
  TX_BLOCK_CONFIRMATIONS,
} from 'config/groups/web3';

import { useTransactionModal } from 'shared/components/transaction-modal';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { TransactionModalState } from 'shared/components/transaction-modal/types';
import { useAddressValidation } from 'providers/address-validation-provider';

import { isUserRejectedError } from '../utils/is-user-rejected-error';
import { useAA } from './use-aa';
import {
  getCompletedStepsFor,
  getFailedBatchOutcome,
  getRetryDecision,
  resolveResumeProgress,
  toProgressKey,
  skipCompletedSteps,
  type ResumeProgress,
} from './send-tx-retry';

// the user stopped an operation after some of its steps were confirmed;
// it is not resumed, so callers reset the form and the next submit starts over
export class OperationAbortedError extends Error {
  constructor(cause: unknown) {
    super('Operation aborted by the user after partial success', { cause });
    this.name = 'OperationAbortedError';
  }
}

export type TransactionEntry = {
  to: Address;
  data: Hex;
  value?: bigint;
  loadingActionText?: string;
  baseDescriptionText?: string;
  awaitingDescriptionText?: string;
  // identifies a non-idempotent step, so it is skipped on resume once confirmed (see resumeKey)
  stepKey?: string;
};

export type TransactionsContext = {
  // steps confirmed by the previous attempt with the same resumeKey, they are not sent again
  completedSteps: ReadonlySet<string>;
};

export type SendTransactionArguments = {
  transactions:
    | TransactionEntry[]
    | ((context: TransactionsContext) => Promise<TransactionEntry[]>);
  mainActionLoadingText: string;
  mainActionCompleteText: string;
  mainActionCompleteDescriptionText?: string;
  forceAtomic?: boolean;
  forceLegacy?: boolean;
  allowRetry?: boolean;
  // retry after some txs were executed is allowed only when the caller rebuilds
  // transactions from fresh on-chain state, so applied steps are not sent again
  allowRetryAfterPartialSuccess?: boolean;
  // fingerprint of the submitted values: the next send with the same key skips
  // steps (by stepKey) confirmed in the previous attempt, so retry continues from the failed tx
  resumeKey?: string;
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
  return receipts
    .map((receipt) =>
      typeof receipt.blockNumber === 'bigint'
        ? receipt.blockNumber
        : hexToBigInt(receipt.blockNumber),
    )
    .reduce((max, block) => (block > max ? block : max), 0n);
};

// unique across all senders: the modal is shared by them
let lastModalSessionId = 0;

export const useSendTransaction = () => {
  const { publicClient, walletClient, setLatestTxBlock } = useLidoSDK();
  const { address } = useDappStatus();
  const { dispatchModal } = useTransactionModal();
  const { retryEvent, retryFire } = useFormControllerRetry();
  const { validateAddress } = useAddressValidation();
  const { isAA } = useAA();
  // confirmed steps of the last failed attempt, kept for the resume with the same key
  const progressRef = useRef<ResumeProgress | undefined>(undefined);
  // the form behind this sender is gone (e.g. the user navigated away while a tx was pending):
  // its retry event has no subscriber, so the modal must not offer a Retry that does nothing
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // only clears the modal's Retry if it is still this sender's
      dispatchModal({ type: 'disable-retry', onRetry: retryFire });
    };
  }, [dispatchModal, retryFire]);
  // copy of the progress after each attempt, so the UI re-renders with what a resubmit will skip
  const [progressSnapshot, setProgressSnapshot] = useState<ResumeProgress>();
  const publishProgress = useCallback(() => {
    const progress = progressRef.current;
    setProgressSnapshot(
      progress && {
        key: progress.key,
        completedSteps: new Set(progress.completedSteps),
      },
    );
  }, []);

  const mutationFn = useCallback(
    async ({
      transactions,
      mainActionCompleteText,
      mainActionLoadingText,
      mainActionCompleteDescriptionText,
      forceAtomic,
      forceLegacy,
      allowRetry = true,
      allowRetryAfterPartialSuccess = false,
      resumeKey,
      renderSuccessContent,
    }: SendTransactionArguments): Promise<TransactionResponse> => {
      // progress of another account or other values must not be reused
      const progressKey = toProgressKey(address, resumeKey);
      progressRef.current = resolveResumeProgress(
        progressRef.current,
        progressKey,
      );
      const progress = progressRef.current;
      // each call is its own modal session, so late results of an older call are ignored
      const sessionId = ++lastModalSessionId;
      const completedSteps = progress?.completedSteps ?? new Set<string>();

      const receipts: TransactionReceipt[] = [];
      const useSendCalls = !forceLegacy && isAA;
      // hash or call id of a sent tx whose result is unknown,
      // retry would build and sign a new tx while this one may be executed
      let unconfirmedTxId: string | undefined;
      // executed calls of a non-atomic AA batch that failed partially
      let partialCallReceipts: NonNullable<
        WaitForCallsStatusReturnType['receipts']
      > = [];

      try {
        // the session starts before any check, so even an early failure is shown in it
        dispatchModal({
          type: 'init',
          sessionId,
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

        const validationResult = await validateAddress(address);
        // if address is not valid, don't send the transaction
        if (!validationResult) {
          throw new Error('Validation failed');
        }

        invariant(
          publicClient && walletClient,
          '[useSendTransaction] Public or wallet clients are not initialized',
        );

        // Optionally callback can be provided if some tx prep is async
        if (typeof transactions === 'function') {
          dispatchModal({
            type: 'stage',
            sessionId,
            stage: 'collecting',
          });

          transactions = await transactions({
            completedSteps: new Set(completedSteps),
          });
        }

        transactions = skipCompletedSteps(transactions, completedSteps);

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
            sessionId,
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
          unconfirmedTxId = id;

          dispatchModal({
            type: 'stage',
            sessionId,
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
            const { executedReceipts, isUnknown } =
              getFailedBatchOutcome(callStatus);
            partialCallReceipts = executedReceipts;
            if (!isUnknown) unconfirmedTxId = undefined;
            throw new Error('Batch failed');
          }

          // the wallet reports the batch as executed, so its result is known from here on
          unconfirmedTxId = undefined;
          const callReceipts = callStatus.receipts ?? [];
          const confirmedReceipts: TransactionReceipt[] = [];

          if (callReceipts.length > 0) {
            const latestReceipt = callReceipts[callReceipts.length - 1];
            try {
              confirmedReceipts.push(
                await publicClient.waitForTransactionReceipt({
                  hash: latestReceipt.transactionHash,
                  confirmations: TX_BLOCK_CONFIRMATIONS,
                  timeout: AA_TX_POLLING_TIMEOUT,
                }),
              );
            } catch (error) {
              // waiting for confirmations failed, but the batch is executed:
              // it is still a success, and the tx block is taken from the wallet receipts
              console.warn(
                '[useSendTransaction] AA receipt confirmations are not awaited',
                error,
              );
            }
          }

          const transactionResult = {
            isAA,
            callStatus,
            receipts: confirmedReceipts,
            lastTxBlock: receiptsToLastBlock([
              ...callReceipts,
              ...confirmedReceipts,
            ]),
          };

          dispatchModal({
            type: 'stage',
            sessionId,
            stage: 'success',
            details: {
              transactionResult,
            },
          });

          setLatestTxBlock(transactionResult.lastTxBlock);
          progressRef.current = undefined;

          return transactionResult;
        }

        for (const tx of transactions) {
          // display each transaction text modal
          dispatchModal({
            type: 'stage',
            sessionId,
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
          unconfirmedTxId = txHash;

          dispatchModal({
            type: 'stage',
            sessionId,
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
          // reverted receipt is a definite result too
          unconfirmedTxId = undefined;

          if (txReceipt.status !== 'success') {
            throw new Error('Transaction failed');
          }
          if (tx.stepKey) progress?.completedSteps.add(tx.stepKey);
        }

        const transactionResult = {
          isAA: useSendCalls,
          receipts,
          lastTxBlock: receiptsToLastBlock(receipts),
        };

        dispatchModal({
          type: 'stage',
          sessionId,
          stage: 'success',
          details: {
            transactionResult,
          },
        });

        setLatestTxBlock(transactionResult.lastTxBlock);
        progressRef.current = undefined;

        return transactionResult;
      } catch (error) {
        // partial success of a batch, so dependent data is fetched with applied txs
        const minedReceipts = [...receipts, ...partialCallReceipts];
        if (minedReceipts.length > 0) {
          setLatestTxBlock(receiptsToLastBlock(minedReceipts));
        }

        const isUnconfirmed = unconfirmedTxId !== undefined;

        const displayError =
          error instanceof DisplayableError
            ? error
            : isUnconfirmed
              ? new SendTxGetStatusError(error)
              : undefined;

        const isUserRejected = isUserRejectedError(error);
        const { canRetry, isPartialSuccess, isAborted } = getRetryDecision({
          isRetryableError: displayError?.isRetryable,
          isUnconfirmed,
          receipts,
          executedCallsCount: partialCallReceipts.length,
          isAA: useSendCalls,
          isTracked: progress !== undefined,
          allowRetryAfterPartialSuccess,
          isUserRejected,
          hasCompletedSteps: (progress?.completedSteps.size ?? 0) > 0,
        });
        // a user stop ends the operation: the next submit starts over instead of skipping steps
        if (isUserRejected) progressRef.current = undefined;

        dispatchModal({
          type: 'stage',
          sessionId,
          stage: 'error',
          // an error arriving after the form unmounted is shown without Retry
          allowRetry: canRetry && isMountedRef.current,
          details: {
            errorText:
              displayError?.message ??
              (isPartialSuccess || isAborted
                ? vaultTexts.common.errors.tx.partialSuccess
                : undefined),
            errorTitle: displayError?.errorTitle,
            // keep link only to the tx with unknown status, drop stale ids of previous txs
            transactionId: unconfirmedTxId,
          },
        });
        console.error(`[useSendTransaction] TX Error`, error);
        throw isAborted ? new OperationAbortedError(error) : error;
      } finally {
        publishProgress();
      }
    },
    [
      address,
      dispatchModal,
      isAA,
      publicClient,
      publishProgress,
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

  // steps a send with this resumeKey (for the connected account) will skip
  const getCompletedSteps = useCallback(
    (resumeKey: string | undefined) =>
      getCompletedStepsFor(progressSnapshot, toProgressKey(address, resumeKey)),
    [address, progressSnapshot],
  );

  return {
    mutation,
    sendTX: mutation.mutateAsync,
    retryEvent,
    retryFire,
    getCompletedSteps,
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
