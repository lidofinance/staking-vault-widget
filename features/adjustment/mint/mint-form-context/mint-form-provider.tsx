import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
  useState,
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
import { SubmitModal } from 'shared/components';
import {
  SubmitPayload,
  SubmitStep,
  SubmitStepEnum,
} from 'shared/components/submit-modal/types';
import { Address } from 'viem';

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
  const [submitStep, setSubmitStep] = useState<{
    step: SubmitStep;
    tx?: Address;
  }>(() => ({ step: SubmitStepEnum.edit }));
  const formObject = useForm<MintFormSchema>({
    defaultValues: {
      amount: undefined,
      token: 'stETH',
      recipient: '' as Address,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callMint } = useMint();
  const { activeVault } = useVaultInfo();

  const mintData = useMemo(() => {
    const mintableStETH = activeVault?.mintableStETH ?? 0n;
    const mintableWstETH = activeVault?.mintableShares ?? 0n;

    return { mintableStETH, mintableWstETH };
  }, [activeVault]);

  const { retryEvent, retryFire } = useFormControllerRetry();
  const setModalState = useCallback((submitStep: SubmitPayload) => {
    setSubmitStep(submitStep);
  }, []);

  const onSubmit = useCallback(
    async ({ recipient, amount, token }: MintFormSchema) => {
      if (amount && recipient) {
        try {
          setModalState({ step: SubmitStepEnum.initiate });
          const tx = await callMint(recipient, amount, token, setModalState);
          setModalState({ step: SubmitStepEnum.overview, tx });
          return true;
        } catch (err) {
          if (
            err instanceof Error &&
            err.message.includes('User rejected the request')
          ) {
            setModalState({ step: SubmitStepEnum.reject });
          } else {
            setModalState({ step: SubmitStepEnum.error });
          }
        }
      }

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <SubmitModal submitStep={submitStep} setModalState={setModalState} />
        </FormControllerContext.Provider>
      </FormProvider>
    </MintDataContext.Provider>
  );
};
