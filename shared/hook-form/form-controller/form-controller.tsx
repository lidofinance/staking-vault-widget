import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { FieldValues, useFormContext, UseFormReset } from 'react-hook-form';
import { useWagmiConnectionChangedCallback } from 'shared/hooks/use-wagmi-connection-changed-callback';
import { useDappStatus } from 'modules/web3';
import type { EventSubsciption } from 'utils/event-subsciption';

type FormControllerProps<F extends FieldValues = any> = {
  onSubmit: (args: F) => Promise<boolean>;
  retryEvent: EventSubsciption;
  afterSubmitResetOptions?: Parameters<UseFormReset<any>>[1] | false;
} & Omit<React.ComponentProps<'form'>, 'onSubmit'>;

export const FormController: FC<PropsWithChildren<FormControllerProps>> = ({
  children,
  onSubmit,
  retryEvent,
  afterSubmitResetOptions,
  ...props
}) => {
  const { isDappActive } = useDappStatus();
  const { handleSubmit, reset: resetDefault } = useFormContext();

  const shouldReset =
    typeof afterSubmitResetOptions == 'boolean' && !afterSubmitResetOptions;

  // Bind submit action
  const doSubmit = useMemo(() => {
    return handleSubmit(async (args) => {
      const success = await onSubmit(args);
      if (success && shouldReset)
        resetDefault(undefined, afterSubmitResetOptions || undefined);
    });
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
    <form
      autoComplete="off"
      onSubmit={doSubmit}
      style={{ width: '100%' }}
      {...props}
    >
      {children}
    </form>
  );
};
