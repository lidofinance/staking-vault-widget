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
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import invariant from 'tiny-invariant';
import { useDappStatus, useLidoSDK } from 'modules/web3';
import { useCreateVaultWihDashboard } from 'modules/vaults/hooks/use-create-vault-with-dashboard';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { SubmitModal } from 'features/create-vault/create-vault-form/submit-modal';

import {
  type CreateVaultDataContextValue,
  CreateVaultStep,
  SubmittingInfo,
} from 'features/create-vault/types';
import {
  createVaultFormValidator,
  createVaultSchema,
  CreateVaultSchema,
  formatCreateVaultData,
} from './validation';

import {
  ToggleValue,
  PermissionToggleEnum,
  CREATE_VAULT_FORM_STEPS,
} from 'features/create-vault/consts';
import { SubmitStepEnum } from 'features/create-vault/types';
import { simulateCreateVault } from 'modules/vaults/contracts/vault-factory';

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
  const { core } = useLidoSDK();
  const { address } = useDappStatus();
  const [step, setStep] = useState(() => CREATE_VAULT_FORM_STEPS.main);
  const [permissionsView, setPermissionsView] = useState<ToggleValue>(
    PermissionToggleEnum.byPermission,
  );
  const [submitStep, setSubmitStep] = useState<SubmittingInfo>();
  const { callCreateVault } = useCreateVaultWihDashboard({
    onMutate: () => setSubmitStep({ step: SubmitStepEnum.submitting }),
  });

  const handleSetStep = useCallback((step: CreateVaultStep) => {
    setStep(step);
  }, []);

  const handleSetPermissionsView = useCallback((value: ToggleValue) => {
    setPermissionsView(value);
  }, []);

  const handleCancelSubmit = useCallback(() => {
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
      assetRecoverer: '',
      nodeOperatorManager: '',
      nodeOperatorFeeBP: 5,
      curatorFeeBP: 5,
      confirmExpiry: 36,
      defaultAdmin: '',
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
      nodeOperatorFeeClaimers: [],
    },
    resolver: createVaultFormValidator(createVaultSchema),
    mode: 'all',
  });

  const onSubmit = useCallback(
    async (data: CreateVaultSchema): Promise<boolean> => {
      setSubmitStep({ step: SubmitStepEnum.initiate });
      const payload = formatCreateVaultData(data);

      try {
        await simulateCreateVault(core.rpcProvider, address, payload);
      } catch (err) {
        console.error('[CreateFormProvider]Error simulating create vault', err);
        setSubmitStep({ step: SubmitStepEnum.error });
        return false;
      }

      setSubmitStep({ step: SubmitStepEnum.confirming });
      try {
        const response = await callCreateVault(payload);
        setSubmitStep({ step: SubmitStepEnum.success, tx: response });
      } catch (err) {
        console.error('[CreateFormProvider] Error sending create vault', err);

        setSubmitStep({ step: SubmitStepEnum.reject });

        return false;
      }

      return true;
    },
    [callCreateVault, address, core.rpcProvider],
  );

  const { retryEvent, retryFire } = useFormControllerRetry();
  const formControllerValue: FormControllerContextValueType<CreateVaultSchema> =
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
