import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import invariant from 'tiny-invariant';

import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useVaultInfo } from 'features/overview/contexts';
import { useMint } from 'features/adjustment/mint/hooks';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { MintFormSchema } from 'features/adjustment/mint/types';

type MintDataContextValue = {
  mintableStETH: bigint;
  mintableWstETH: bigint;
};

const MintDataContext = createContext<MintDataContextValue | null>(null);
MintDataContext.displayName = 'MintDataContext';

export const useMintFormData = () => {
  const value = useContext(MintDataContext);
  invariant(
    value,
    'useMintFormData was used outside the MintDataContext provider',
  );

  return value;
};

export const MintFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const formObject = useForm<MintFormSchema>({
    defaultValues: {
      amount: undefined,
      token: 'stETH',
      recipient: undefined,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callMint } = useMint();
  const { activeVault } = useVaultInfo();

  const mintData = useMemo(() => {
    const mintableStETH = activeVault?.mintableStETH ?? 0n;
    const mintableWstETH =
      (activeVault?.shareLimit ?? 0n) - (activeVault?.liabilityShares ?? 0n);

    return { mintableStETH, mintableWstETH };
  }, [activeVault]);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const onSubmit = useCallback(
    async ({ recipient, amount, token }: MintFormSchema) => {
      if (amount && recipient) {
        await callMint(recipient, amount, token);
        return true;
      }

      return false;
    },
    [callMint],
  );

  const formControllerValue: FormControllerContextValueType<MintFormSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryEvent,
        retryFire,
        onReset: formObject.reset,
      }),
      [retryFire, retryEvent, onSubmit, formObject.reset],
    );

  return (
    <MintDataContext.Provider value={mintData}>
      <FormProvider {...formObject}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
        </FormControllerContext.Provider>
      </FormProvider>
    </MintDataContext.Provider>
  );
};
