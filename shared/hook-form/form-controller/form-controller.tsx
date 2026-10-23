import { useEffect, useMemo, useRef } from 'react';
import {
  FieldValues,
  FormProvider,
  UseFormReset,
  UseFormReturn,
} from 'react-hook-form';
import { useWagmiConnectionChangedCallback } from 'shared/hooks/use-wagmi-connection-changed-callback';
import { useDappStatus } from 'modules/web3';
import type { EventSubsciption } from 'utils/event-subsciption';

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
  // Guards against retry fired while form is disabled (e.g. vault data is reloading after tx)
  const isDisabledRef = useRef(false);
  isDisabledRef.current = Boolean(formObject.formState.disabled);

  // Bind submit action
  const doSubmit = useMemo(() => {
    const submit = handleSubmit(async (args) => {
      const success = await onSubmit(args);
      if (success && shouldReset)
        resetDefault(undefined, afterSubmitResetOptions || undefined);
    });
    return async (event?: React.BaseSyntheticEvent) => {
      if (isSubmittingRef.current || isDisabledRef.current) {
        event?.preventDefault();
        return;
      }
      isSubmittingRef.current = true;
      try {
        await submit(event);
      } finally {
        isSubmittingRef.current = false;
      }
    };
  }, [
    afterSubmitResetOptions,
    handleSubmit,
    onSubmit,
    resetDefault,
    shouldReset,
  ]);

  // Bind retry callback
  useEffect(() => {
    return retryEvent.subscribe(doSubmit);
  }, [retryEvent, doSubmit]);

  // Reset form amount after disconnect wallet
  useEffect(() => {
    if (!isDappActive) resetDefault();
    // reset will be captured when active changes
    // so we don't need it in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDappActive]);

  // Reset the form when chain id or wallet address changed
  useWagmiConnectionChangedCallback(resetDefault);

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
