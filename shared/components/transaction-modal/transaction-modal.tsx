import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import type { TransactionModalContextValue } from './types';
import {
  initialTransactionModalState,
  transactionModalReducer,
} from './reducer';
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

export const TransactionModal = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(
    transactionModalReducer,
    initialTransactionModalState,
  );
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
