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

import { useVaultInfo } from 'modules/vaults';
import { useMint } from 'features/adjustment/mint/hooks';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { MintFormSchema } from 'features/adjustment/mint/types';
import { Address } from 'viem';

type MintDataContextValue = {
  mintableStETH: bigint;
  mintableWstETH: bigint;
  lockedEther: bigint;
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
      recipient: '' as Address,
    },
    mode: 'all',
    // TODO: validation
    reValidateMode: 'onChange',
  });
  const { mint, retryEvent } = useMint();
  const { activeVault } = useVaultInfo();

  const mintData = useMemo(() => {
    const mintableStETH = activeVault?.mintableStETH ?? 0n;
    const mintableWstETH = activeVault?.mintableShares ?? 0n;
    const lockedEther = activeVault?.locked ?? 0n;

    return {
      mintableStETH,
      mintableWstETH,
      lockedEther,
    };
  }, [activeVault]);

  const onSubmit = useCallback(
    async ({ recipient, amount, token }: MintFormSchema) => {
      // TODO: add validation, remove stub
      if (!recipient || !amount) return false;
      invariant(recipient, '[MintFormProvider] recipient is undefined');
      invariant(amount, '[MintFormProvider] amount is undefined');
      invariant(token, '[MintFormProvider] token is undefined');

      return await mint(recipient, amount, token);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mint],
  );

  const formControllerValue: FormControllerContextValueType<MintFormSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryEvent,
        onReset: formObject.reset,
      }),
      [retryEvent, onSubmit, formObject.reset],
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
