import { Dispatch } from 'react';

type TransactionModalStage =
  | 'none'
  | 'collecting'
  | 'signing'
  | 'awaiting'
  | 'success'
  | 'error';

type TransactionModalDetails = {
  actionLoadingText: string;
  actionCompleteText: string;
  renderSuccessContent?: () => JSX.Element;
  errorText?: string;
  errorDescription?: string;
  // txHash or callId depending on isBatch
  transactionId?: string;
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
      details?: Partial<TransactionModalDetails>;
    };

export type TransactionModalContextValue = TransactionModalState & {
  dispatchModal: Dispatch<TransactionModalAction>;
};
