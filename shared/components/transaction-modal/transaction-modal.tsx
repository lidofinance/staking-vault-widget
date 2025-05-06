import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import type {
  TransactionModalAction,
  TransactionModalContextValue,
  TransactionModalState,
} from './types';

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

const reducer = (
  state: TransactionModalState,
  action: TransactionModalAction,
): TransactionModalState => {
  const { type, ...payload } = action;
  switch (type) {
    case 'init':
      return {
        ...payload,
        details: {
          ...state.details,
          ...(action.details ?? {}),
        },
      } as TransactionModalState;
    case 'open':
    case 'close':
      return {
        ...state,
        isOpen: action.type === 'open',
      };
    case 'stage':
      return {
        ...state,
        isOpen: true,
        stage: action.stage,
        details: {
          ...state.details,
          ...(action.details ?? {}),
        },
      };
    default:
      return state;
  }
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => {
    return {
      ...state,
      dispatchModal: dispatch,
    };
  }, [state]);

  return (
    <TransactionModalContext.Provider value={value}>
      {children}
    </TransactionModalContext.Provider>
  );
};
