import type { TransactionModalAction, TransactionModalState } from './types';

export const transactionModalReducer = (
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
    case 'disable-retry':
      // only the attempt that owns the modal can take its Retry away
      return state.onRetry === action.onRetry
        ? { ...state, onRetry: undefined }
        : state;
    case 'stage':
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
