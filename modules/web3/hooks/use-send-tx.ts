import { useCallback, useRef } from 'react';
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

import { useAA } from './use-aa';

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

export const useSendTransaction = () => {
  const { publicClient, walletClient, setLatestTxBlock } = useLidoSDK();
  const { address } = useDappStatus();
  const { dispatchModal } = useTransactionModal();
  const { retryEvent, retryFire } = useFormControllerRetry();
  const { validateAddress } = useAddressValidation();
  const { isAA } = useAA();
  // confirmed steps of the last failed attempt, kept for the resume with the same key
  const progressRef = useRef<
    { key: string; completedSteps: Set<string> } | undefined
  >(undefined);

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
      const progressKey =
        resumeKey === undefined ? undefined : `${address}:${resumeKey}`;
      if (progressRef.current?.key !== progressKey) {
        progressRef.current =
          progressKey === undefined
            ? undefined
            : { key: progressKey, completedSteps: new Set() };
      }
      const progress = progressRef.current;
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
        const validationResult = await validateAddress(address);
        // if address is not valid, don't send the transaction
        if (!validationResult) {
          throw new Error('Validation failed');
        }

        invariant(
          publicClient && walletClient,
          '[useSendTransaction] Public or wallet clients are not initialized',
        );

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

          transactions = await transactions({
            completedSteps: new Set(completedSteps),
          });
        }

        transactions = transactions.filter(
          (tx) => !tx.stepKey || !completedSteps.has(tx.stepKey),
        );

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
          unconfirmedTxId = id;

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
            partialCallReceipts =
              callStatus.receipts?.filter(
                (receipt) => receipt.status === 'success',
              ) ?? [];
            // 600 is a partial revert: some calls are executed, but without receipts we can't tell which
            if (
              partialCallReceipts.length > 0 ||
              callStatus.statusCode !== 600
            ) {
              unconfirmedTxId = undefined;
            }
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
          unconfirmedTxId = undefined;

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
          progressRef.current = undefined;

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
          unconfirmedTxId = txHash;

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
        const isPartialSuccess =
          receipts.some((receipt) => receipt.status === 'success') ||
          partialCallReceipts.length > 0;

        const displayError =
          error instanceof DisplayableError
            ? error
            : isUnconfirmed
              ? new SendTxGetStatusError(error)
              : undefined;

        // retry signs new txs, so it must not replay a tx that may be executed
        // or steps that are already applied
        // executed calls of a partially failed AA batch can't be mapped to steps,
        // so a resume would send them again
        const isUntrackedPartialSuccess =
          isPartialSuccess && useSendCalls && progress !== undefined;
        const canRetry =
          (displayError?.isRetryable ?? true) &&
          !isUnconfirmed &&
          !isUntrackedPartialSuccess &&
          (!isPartialSuccess || allowRetryAfterPartialSuccess);

        dispatchModal({
          type: 'stage',
          stage: 'error',
          allowRetry: canRetry,
          details: {
            errorText:
              displayError?.message ??
              (isPartialSuccess
                ? vaultTexts.common.errors.tx.partialSuccess
                : undefined),
            errorTitle: displayError?.errorTitle,
            // keep link only to the tx with unknown status, drop stale ids of previous txs
            transactionId: unconfirmedTxId,
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
