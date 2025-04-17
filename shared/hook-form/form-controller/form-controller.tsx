import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormControllerContext } from 'shared/hook-form/form-controller/form-controller-context';
import { useWagmiConnectionChangedCallback } from 'shared/hooks/use-wagmi-connection-changed-callback';
import { useDappStatus } from 'modules/web3';

type FormControllerProps = React.ComponentProps<'form'>;

export const FormController: FC<PropsWithChildren<FormControllerProps>> = ({
  children,
  ...props
}) => {
  const { isDappActive } = useDappStatus();
  const { handleSubmit, reset: resetDefault } = useFormContext();
  const { onSubmit, retryEvent } = useFormControllerContext();

  // Bind submit action
  const doSubmit = useMemo(() => {
    return handleSubmit(async (args) => {
      const success = await onSubmit(args);
      if (success) resetDefault();
    });
  }, [handleSubmit, onSubmit, resetDefault]);

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
