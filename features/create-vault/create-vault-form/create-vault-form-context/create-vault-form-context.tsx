import {
  FC,
  PropsWithChildren,
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
  useRef,
} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import invariant from 'tiny-invariant';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { SubmitModal } from 'features/create-vault/create-vault-form/submit-modal';

import { SubmitStep } from 'features/create-vault/types';
import { type CreateVaultDataContextValue } from './types';
import { createVaultFormValidator, CreateVaultSchema } from './validation';

import { sleep } from 'utils';

import { ToggleValue, CREATE_VAULT_STEPS } from 'features/create-vault/consts';
import { SubmitStepEnum } from 'features/create-vault/types';
import { useCreateVaultWithDelegation } from 'modules/web3/hooks/use-create-vault-with-delegation';

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

export const CreateFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [permissionsView, setPermissionsView] =
    useState<ToggleValue>('by_permission');
  const [submitStep, setSubmitStep] = useState<SubmitStep>();
  const abortControllerRef = useRef<AbortController | null>(null);
  const callVaultFactoryContract = useCreateVaultWithDelegation();

  const handleSetStep = useCallback((step: number) => {
    if (step >= 1 && step <= CREATE_VAULT_STEPS) {
      setStep(step);
    }
  }, []);

  const handleSetPermissionsView = useCallback((value: ToggleValue) => {
    setPermissionsView(value);
  }, []);

  const handleCancelSubmit = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setSubmitStep(void 0);
  }, []);

  const createVaultData = {
    step,
    permissionsView,
    submitStep,
    handleSetStep,
    handleSetPermissionsView,
    handleCancelSubmit,
  };

  const formObject = useForm<CreateVaultSchema>({
    defaultValues: {
      nodeOperator: '',
      nodeOperatorManager: '',
      nodeOperatorFeeBP: 5,
      curatorFeeBP: 5,
      confirmExpiry: 36,
      defaultAdmin: '',
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
    resolver: createVaultFormValidator,
    mode: 'all',
  });

  const onSubmit = useCallback(
    async (data: any): Promise<boolean> => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setSubmitStep(SubmitStepEnum.initiate);
      await sleep(5000);
      setSubmitStep(SubmitStepEnum.confirming);
      // sendTransaction
      await sleep(5000);
      // regect or proceed
      setSubmitStep(SubmitStepEnum.submitting);
      await callVaultFactoryContract(data);
      await sleep(5000);
      setSubmitStep(SubmitStepEnum.success);

      return true;
    },
    [callVaultFactoryContract],
  );

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

  // TODO: check controls values
  const formControllerValue: FormControllerContextValueType<CreateVaultSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryEvent,
        onReset: formObject.reset,
      }),
      [retryEvent, onSubmit, formObject.reset],
    );

  return (
    <FormProvider {...formObject}>
      <CreateVaultDataContext.Provider value={createVaultData}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
          <SubmitModal />
        </FormControllerContext.Provider>
      </CreateVaultDataContext.Provider>
    </FormProvider>
  );
};
