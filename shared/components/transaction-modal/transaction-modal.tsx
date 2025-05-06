import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import {
  Loader,
  Modal,
  Success,
  Error as ErrorIcon,
  Text,
} from '@lidofinance/lido-ui';

import styled from 'styled-components';
import { TxLinkAA, TxLinkEtherscan } from '../tx-link-etherscan';

import type { Hash } from 'viem';
import { ButtonLink } from '../button-link';

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

type TransactionModalState = {
  isOpen: boolean;
  isBatch: boolean;
  onRetry?: () => void;
  stage: TransactionModalStage;
  details: TransactionModalDetails;
};

type TransactionModalAction =
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

type TransactionModalContextValue = TransactionModalState & {
  dispatchModal: Dispatch<TransactionModalAction>;
};

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

const getIconComponent = (state: TransactionModalState) => {
  switch (state.stage) {
    case 'collecting':
    case 'signing':
    case 'awaiting':
    default:
      return <Loader size="large" />;
    case 'success':
      return <Success fill="var(--lido-color-success)" />;
    case 'error':
      return <ErrorIcon />;
  }
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
`;

const getModalTitle = (state: TransactionModalState) => {
  switch (state.stage) {
    case 'collecting':
    case 'signing':
    case 'awaiting':
      return state.details.actionLoadingText;
    case 'error':
      return 'Transaction error';
    case 'success':
      return state.details.actionCompleteText;
    default:
      return 'Transaction';
  }
};

const getMainContent = (state: TransactionModalState) => {
  switch (state.stage) {
    case 'collecting':
      return (
        <Text color="secondary" size="xxs">
          Fetching transaction data
        </Text>
      );
    case 'signing':
      return (
        <Text color="secondary" size="xxs">
          Confirm this transaction in your wallet
        </Text>
      );
    case 'awaiting':
      return (
        <Text color="secondary" size="xxs">
          Awaiting block confirmation
        </Text>
      );
    case 'success':
      return state.details.renderSuccessContent?.() ?? null;
    case 'error':
      return (
        <Text color="secondary" size="xxs">
          {state.details.errorText ?? 'Something went wrong'}
        </Text>
      );
    default:
      return null;
  }
};

const showEtherscanLink = (state: TransactionModalState) => {
  if (
    state.details.transactionId &&
    (state.stage === 'awaiting' || state.stage === 'success')
  ) {
    if (state.isBatch) {
      return <TxLinkAA callId={state.details.transactionId} />;
    }
    return <TxLinkEtherscan txHash={state.details.transactionId as Hash} />;
  }
};

const showRetryButton = (state: TransactionModalState) => {
  if (state.onRetry && state.stage === 'error') {
    return (
      <ButtonLink
        onClick={() => {
          state.onRetry?.();
        }}
      >
        Retry
      </ButtonLink>
    );
  }
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
      <Modal
        center
        titleIcon={getIconComponent(state)}
        title={getModalTitle(state)}
        open={state.isOpen && state.stage !== 'none'}
        onClose={() => {
          dispatch({ type: 'close' });
        }}
      >
        <Content>
          {getMainContent(state)}
          {showEtherscanLink(state)}
          {showRetryButton(state)}
        </Content>
      </Modal>
    </TransactionModalContext.Provider>
  );
};
