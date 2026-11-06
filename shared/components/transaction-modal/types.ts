import type { TransactionResponse } from 'modules/web3';
import type { Dispatch } from 'react';

type TransactionModalStage =
  | 'none'
  | 'collecting'
  | 'signing'
  | 'awaiting'
  | 'success'
  | 'error';

export type ModalRenderSuccessContent = (props: {
  closeModal: () => void;
  result: TransactionResponse;
}) => JSX.Element;

type TransactionModalDetails = {
  actionLoadingText: string;
  baseDescriptionText?: string;
  awaitingDescriptionText?: string;
  actionCompleteText: string;
  mainActionCompleteDescriptionText?: string;
  renderSuccessContent?: ModalRenderSuccessContent;
  errorText?: string;
  errorTitle?: string;
  // txHash or callId depending on isBatch
  transactionId?: string;
  transactionResult?: TransactionResponse;
};

export type TransactionModalState = {
  // the send operation the modal currently belongs to (0 before the first one);
  // set by 'init', and 'stage' of any other operation is ignored, so a late result
  // of an older operation can't overwrite a newer one or reuse its Retry
  sessionId: number;
  isOpen: boolean;
  isBatch: boolean;
  // resolves when the retry attempt it starts has ended (or right away if it was queued)
  onRetry?: () => void | Promise<unknown>;
  stage: TransactionModalStage;
  details: TransactionModalDetails;
};

export type TransactionModalAction =
  | ({
      type: 'init';
      details?: Partial<TransactionModalDetails>;
    } & Omit<TransactionModalState, 'details'>)
  | {
      type: 'open' | 'close';
    }
  | {
      // takes Retry away from the current stage without reopening a closed modal
      type: 'disable-retry';
      // retry callback of the sender requesting it; ignored if the modal now belongs to another sender
      onRetry: NonNullable<TransactionModalState['onRetry']>;
    }
  | {
      type: 'stage';
      // the operation that dispatches it, see TransactionModalState.sessionId
      sessionId: number;
      stage: Exclude<TransactionModalStage, 'none'>;
      allowRetry?: boolean;
      details?: Partial<TransactionModalDetails>;
    };

export type TransactionModalContextValue = TransactionModalState & {
  dispatchModal: Dispatch<TransactionModalAction>;
};
