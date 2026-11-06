import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FieldValues,
  FormProvider,
  UseFormReset,
  UseFormReturn,
} from 'react-hook-form';

import { runExclusive } from 'utils/run-exclusive';
import { useWagmiConnectionChangedCallback } from 'shared/hooks/use-wagmi-connection-changed-callback';
import { useDappStatus } from 'modules/web3';
import { useTransactionModal } from 'shared/components/transaction-modal';
import type { EventSubsciption } from 'utils/event-subsciption';

import {
  canRunQueuedRetry,
  shouldCloseAfterRetry,
  type QueuedRetry,
  type SubmitOutcome,
} from './queued-retry';

type FormControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues,
> = {
  formObject: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  onSubmit: (values: TTransformedValues) => Promise<boolean>;
  retryEvent: EventSubsciption;
  afterSubmitResetOptions?: Parameters<UseFormReset<any>>[1] | false;
} & Omit<React.ComponentProps<'form'>, 'onSubmit'>;

export const FormController = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues,
>({
  children,
  onSubmit,
  retryEvent,
  formObject,
  afterSubmitResetOptions,
  ...props
}: FormControllerProps<TFieldValues, TContext, TTransformedValues>) => {
  const { isDappActive } = useDappStatus();
  const { handleSubmit, reset: resetDefault } = formObject;

  const shouldReset =
    typeof afterSubmitResetOptions == 'boolean'
      ? afterSubmitResetOptions
      : true;

  // Guards against retry fired while previous submit is still in progress
  // (e.g. modal shows error, but form is still refetching and resetting)
  const isSubmittingRef = useRef(false);
  // same as isSubmittingRef, but re-renders, so a queued retry runs when the submit ends
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Guards against retry fired while form is disabled (e.g. vault data is reloading after tx)
  const isDisabled = Boolean(formObject.formState.disabled);
  const isDisabledRef = useRef(false);
  isDisabledRef.current = isDisabled;
  // Retry clicked while the form was busy, it runs once the form is ready (see QueuedRetry)
  const [queuedRetry, setQueuedRetry] = useState<QueuedRetry>();
  const { isOpen, stage, onRetry, sessionId, dispatchModal } =
    useTransactionModal();
  // the modal at click time, read synchronously in the retry handler
  const modalRef = useRef({ onRetry, sessionId });
  modalRef.current = { onRetry, sessionId };

  // Bind submit action
  const doSubmit = useMemo(() => {
    return async (event?: React.BaseSyntheticEvent): Promise<SubmitOutcome> => {
      if (isSubmittingRef.current || isDisabledRef.current) {
        event?.preventDefault();
        return 'skipped';
      }
      let isInvalid = false;
      const submit = handleSubmit(
        async (args) => {
          const success = await onSubmit(args);
          if (success && shouldReset)
            resetDefault(undefined, afterSubmitResetOptions || undefined);
        },
        () => {
          isInvalid = true;
        },
      );
      // a new submit replaces a retry queued for the previous one
      setQueuedRetry(undefined);
      setIsSubmitting(true);
      try {
        await runExclusive(isSubmittingRef, () => submit(event), undefined);
      } finally {
        // after the lock is released, so the queued retry is not dropped by it
        setIsSubmitting(false);
      }
      return isInvalid ? 'invalid' : 'submitted';
    };
  }, [
    afterSubmitResetOptions,
    handleSubmit,
    onSubmit,
    resetDefault,
    shouldReset,
  ]);

  // a retry clicked on the error of `clickedSession`
  const runRetry = useCallback(
    async (clickedSession: number) => {
      const outcome = await doSubmit();
      if (
        shouldCloseAfterRetry(
          outcome,
          clickedSession,
          modalRef.current.sessionId,
        )
      ) {
        dispatchModal({ type: 'close' });
      }
    },
    [doSubmit, dispatchModal],
  );

  // Bind retry callback
  useEffect(() => {
    return retryEvent.subscribe(() => {
      // a retry while busy is queued instead of dropped, otherwise the Retry click does nothing
      if (isSubmittingRef.current || isDisabledRef.current) {
        const { onRetry: clicked, sessionId: clickedSession } =
          modalRef.current;
        setQueuedRetry(
          clicked ? { onRetry: clicked, sessionId: clickedSession } : undefined,
        );
        return;
      }
      // returned, so the modal's Retry stays locked until this attempt ends
      return runRetry(modalRef.current.sessionId);
    });
  }, [retryEvent, runRetry]);

  // Run the queued retry once the form is ready, unless the modal no longer offers it
  const canRunQueued =
    !!queuedRetry &&
    canRunQueuedRetry({ isOpen, stage, onRetry, sessionId }, queuedRetry);
  useEffect(() => {
    if (!queuedRetry || isSubmitting || isDisabled) return;
    setQueuedRetry(undefined);
    if (canRunQueued) void runRetry(queuedRetry.sessionId);
  }, [queuedRetry, isSubmitting, isDisabled, canRunQueued, runRetry]);

  // Reset form amount after disconnect wallet
  useEffect(() => {
    if (!isDappActive) resetDefault();
    // reset will be captured when active changes
    // so we don't need it in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDappActive]);

  // Reset the form when chain id or wallet address changed.
  // A queued retry belongs to the previous connection: the modal's retry callback is stable
  // across accounts, so the queue is dropped here, otherwise it would send from the new account
  const onConnectionChanged = useCallback(() => {
    setQueuedRetry(undefined);
    resetDefault();
  }, [resetDefault]);
  useWagmiConnectionChangedCallback(onConnectionChanged);

  return (
    <FormProvider {...formObject}>
      <form
        autoComplete="off"
        onSubmit={doSubmit}
        style={{ width: '100%' }}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};
