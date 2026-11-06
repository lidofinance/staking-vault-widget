import {
  extractCodeFromError,
  SAFE_USER_REJECTED_CODE,
  SAFE_USER_REJECTED_MESSAGE,
  USER_REJECTED_ERROR_CODES,
} from 'utils/getErrorMessage';

// viem wraps wallet errors (e.g. TransactionExecutionError -> UserRejectedRequestError),
// and extractCodeFromError does not follow `cause`, so the chain is walked here
const MAX_CAUSE_DEPTH = 10;

// tells a request the user declined in the wallet from other tx failures,
// uses the same codes as DENIED_SIG in getErrorMessage
export const isUserRejectedError = (error: unknown): boolean => {
  let current: unknown = error;
  for (let depth = 0; depth < MAX_CAUSE_DEPTH; depth++) {
    if (!current || typeof current !== 'object') return false;

    if (USER_REJECTED_ERROR_CODES.includes(extractCodeFromError(current))) {
      return true;
    }
    if ('name' in current && current.name === 'UserRejectedRequestError') {
      return true;
    }
    if (
      'code' in current &&
      current.code === SAFE_USER_REJECTED_CODE &&
      'message' in current &&
      current.message === SAFE_USER_REJECTED_MESSAGE
    ) {
      return true;
    }

    current = 'cause' in current ? current.cause : undefined;
  }
  return false;
};
