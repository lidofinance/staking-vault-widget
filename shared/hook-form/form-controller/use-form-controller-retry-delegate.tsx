import { EventSubsciption } from 'utils/event-subsciption';
import { useCallback, useMemo } from 'react';

export const useFormControllerRetry = () => {
  const retryEvent = useMemo(() => new EventSubsciption(), []);

  // resolves when the retry attempt ends (see TransactionModalState.onRetry)
  const retryFire = useCallback(() => retryEvent.fire(), [retryEvent]);

  return {
    retryFire,
    retryEvent,
  };
};
