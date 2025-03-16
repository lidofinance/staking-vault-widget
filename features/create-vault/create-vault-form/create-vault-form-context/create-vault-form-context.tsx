import {
  FC,
  PropsWithChildren,
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import invariant from 'tiny-invariant';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';

import {
  type CreateVaultDataContextValue,
  // type CreateVaultFormInput,
} from './types';
import { createVaultSchema, CreateVaultSchema } from './validation';

import { CREATE_VAULT_STEPS } from 'consts/vault-factory';

const CreateVaultDataContext =
  createContext<CreateVaultDataContextValue | null>(null);
CreateVaultDataContext.displayName = 'CreateVaultDataContext';

export const useCreateVaultFormData = () => {
  const value = useContext(CreateVaultDataContext);
  invariant(
    value,
    'useCreateVaultData was used outside the CreateVaultDataContext provider',
  );

  return value;
};

// TODO: update onSubmit fn
const onSubmit = async (): Promise<boolean> => {
  return true;
};

export const CreateFormProvider: FC<PropsWithChildren> = ({ children }) => {
  // const validationContextPromise = useCreateVaultValidationContext({});

  const [step, setStep] = useState(1);
  const handleSetStep = useCallback((step: number) => {
    if (step >= 1 && step <= CREATE_VAULT_STEPS) {
      setStep(step);
    }
  }, []);

  const formObject = useForm<CreateVaultSchema>({
    defaultValues: {
      nodeOperatorManager: '0x',
      nodeOperatorFeeBP: 5,
      curatorFeeBP: 5,
      confirmExpiry: 36,
      defaultAdmin: '0x',
      confirmMainSettings: false,
      funders: [],
      withdrawers: [],
      minters: [],
      burners: [],
      rebalancers: [],
      depositPausers: [],
      depositResumers: [],
      validatorExitRequesters: [],
      validatorWithdrawalTriggerers: [],
      disconnecters: [],
      curatorFeeSetters: [],
      curatorFeeClaimers: [],
      nodeOperatorFeeClaimers: [],
    },
    // context: validationContextPromise,
    resolver: zodResolver(createVaultSchema),
  });
  // const { setValue } = formObject;

  // consumes amount query param
  // SSG safe
  // const { isReady, query, pathname, replace } = useRouter();

  // useEffect(() => {
  //   if (!isReady) return;
  //   try {
  //     const { amount, ref, ...rest } = query;
  //
  //     if (typeof ref === 'string') {
  //       setValue('referral', ref);
  //     }
  //     if (typeof amount === 'string') {
  //       void replace({ pathname, query: rest });
  //       const amountBigInt = parseEther(amount);
  //       setValue('amount', amountBigInt);
  //     }
  //   } catch {
  //     //noop
  //   }
  // }, [isReady, pathname, query, replace, setValue]);

  const { retryEvent } = useFormControllerRetry();

  // const stake = useStake({
  //   onConfirm: networkData.revalidate,
  //   onRetry: retryFire,
  // });

  // TODO: check controls values
  const formControllerValue: FormControllerContextValueType<CreateVaultSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryEvent,
      }),
      [retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <CreateVaultDataContext.Provider value={{ step, handleSetStep }}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
        </FormControllerContext.Provider>
      </CreateVaultDataContext.Provider>
    </FormProvider>
  );
};
