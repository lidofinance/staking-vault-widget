import type { TransactionModalAction, TransactionModalState } from './types';

export const initialTransactionModalState: TransactionModalState = {
  sessionId: 0,
  isBatch: false,
  isOpen: false,
  stage: 'none',
  onRetry: undefined,
  details: {
    actionLoadingText: '',
    actionCompleteText: '',
  },
};

export const transactionModalReducer = (
  state: TransactionModalState,
  action: TransactionModalAction,
): TransactionModalState => {
  const { type, ...payload } = action;
  switch (type) {
    case 'init':
      // a new session starts clean: result, error and tx link of the previous one are dropped
      return {
        ...payload,
        details: {
          ...initialTransactionModalState.details,
          ...(action.details ?? {}),
        },
      } as TransactionModalState;
    case 'open':
    case 'close':
      return {
        ...state,
        isOpen: action.type === 'open',
      };
    case 'disable-retry':
      // only the attempt that owns the modal can take its Retry away
      return state.onRetry === action.onRetry
        ? { ...state, onRetry: undefined }
        : state;
    case 'stage':
      // a late stage of an older operation (e.g. its receipt wait failed after the user
      // closed its modal and started another one) must not touch the current session
      if (action.sessionId !== state.sessionId) return state;
      return {
        ...state,
        isOpen: true,
        stage: action.stage,
        // allowRetry false can override previous onRetry setting
        onRetry: action.allowRetry === false ? undefined : state.onRetry,
        details: {
          ...state.details,
          ...(action.details ?? {}),
        },
      };
    default:
      return state;
  }
};
