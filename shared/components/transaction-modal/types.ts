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
  actionCompleteText: string;
  renderSuccessContent?: ModalRenderSuccessContent;
  errorText?: string;
  errorTitle?: string;
  // txHash or callId depending on isBatch
  transactionId?: string;
  transactionResult?: TransactionResponse;
};

export type TransactionModalState = {
  isOpen: boolean;
  isBatch: boolean;
  onRetry?: () => void;
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
      type: 'stage';
      stage: Exclude<TransactionModalStage, 'none'>;
      allowRetry?: boolean;
      details?: Partial<TransactionModalDetails>;
    };

export type TransactionModalContextValue = TransactionModalState & {
  dispatchModal: Dispatch<TransactionModalAction>;
};
