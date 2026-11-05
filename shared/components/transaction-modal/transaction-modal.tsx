import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import type {
  TransactionModalContextValue,
  TransactionModalState,
} from './types';
import { transactionModalReducer } from './reducer';
import { TransactionModalContent } from './transaction-modal-content';

const TransactionModalContext =
  createContext<TransactionModalContextValue | null>(null);
TransactionModalContext.displayName = 'TransactionModalContext';

export const useTransactionModal = () => {
  const context = useContext(TransactionModalContext);
  if (!context) {
    throw new Error(
      'useTransactionModalContext must be used within a TransactionModalProvider',
    );
  }
  return context;
};

const initialState: TransactionModalState = {
  isBatch: false,
  isOpen: false,
  stage: 'none',
  onRetry: undefined,
  details: {
    actionLoadingText: '',
    actionCompleteText: '',
  },
};

export const TransactionModal = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(transactionModalReducer, initialState);
  const value = useMemo(() => {
    return {
      ...state,
      dispatchModal: dispatch,
    };
  }, [state]);

  return (
    <TransactionModalContext.Provider value={value}>
      {children}
      <TransactionModalContent />
    </TransactionModalContext.Provider>
  );
};
