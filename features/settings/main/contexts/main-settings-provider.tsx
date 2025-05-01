import {
  FC,
  PropsWithChildren,
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
  useRef,
  useEffect,
} from 'react';
import invariant from 'tiny-invariant';
import { useForm, FormProvider } from 'react-hook-form';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { SubmitModal } from 'shared/components';

import {
  SubmitPayload,
  SubmitStepEnum,
} from 'shared/components/submit-modal/types';
import {
  EditMainSettingsSchema,
  MainSettingsContextValue,
  ManagersKeys,
  RoleFieldSchema,
} from 'features/settings/main/types';
import {
  useEditMainSettings,
  useSimulateEditMainSettings,
} from 'features/settings/main/hooks';
import { validateFormWithZod } from 'utils/validate-form-value';
import {
  editMainSettingsSchema,
  multipleDataFields,
} from 'features/settings/main/consts';
import { useVaultInfo } from 'modules/vaults';
import { Address } from 'viem';

const MainSettingsContext = createContext<MainSettingsContextValue | null>(
  null,
);
MainSettingsContext.displayName = 'MainSettingsContext';

export const useMainSettingsData = () => {
  const value = useContext(MainSettingsContext);
  invariant(
    value,
    'useMainSettingsData was used outside the MainSettingsContext provider',
  );

  return value;
};

export const MainSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [submitStep, setSubmitStep] = useState<SubmitPayload>(() => ({
    step: SubmitStepEnum.edit,
  }));
  const abortControllerRef = useRef(new AbortController());
  const { activeVault, refetch, isRefetching } = useVaultInfo();
  const { callEditMainSettings } = useEditMainSettings();
  const { simulateEditMainSettings } = useSimulateEditMainSettings();

  const handleCancelSubmit = useCallback(() => {
    abortControllerRef.current.abort();
    setSubmitStep({ step: SubmitStepEnum.edit });
  }, []);

  const createVaultData = {
    submitStep,
    handleCancelSubmit,
  };

  const setModalState = useCallback((submitStep: SubmitPayload) => {
    setSubmitStep(submitStep);
  }, []);

  const formObject = useForm<EditMainSettingsSchema>({
    defaultValues: {
      nodeOperatorManagers: [],
      nodeOperatorFeeBP: [],
      confirmExpiry: [],
      defaultAdmins: [],
    },
    resolver: validateFormWithZod(editMainSettingsSchema),
    mode: 'all',
  });

  useEffect(() => {
    if (!isRefetching) {
      (multipleDataFields as ManagersKeys[]).map((key) => {
        const managersAddresses = activeVault?.[key];
        if (managersAddresses && managersAddresses.length > 0) {
          managersAddresses.forEach((address: Address, index: number) => {
            const value = {
              value: address,
              state: 'display',
              isGranted: true,
            } as unknown as RoleFieldSchema;
            formObject.setValue(`${key}.${index}` as const, value);
          });
        }
      });
    }
  }, [formObject, activeVault, isRefetching]);

  const onSubmit = useCallback(
    async (data: EditMainSettingsSchema): Promise<boolean> => {
      abortControllerRef.current = new AbortController();
      setModalState({ step: SubmitStepEnum.initiate });
      try {
        setModalState({ step: SubmitStepEnum.simulating });
        await simulateEditMainSettings(data);
      } catch (err) {
        setModalState({ step: SubmitStepEnum.error });
        return false;
      }

      try {
        await callEditMainSettings(data, setModalState, abortControllerRef);
        setModalState({ step: SubmitStepEnum.success });
        setTimeout(refetch, 1000);
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

        setTimeout(refetch, 1000);
        return true;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callEditMainSettings, refetch],
  );

  const { reset } = formObject;
  const { retryEvent, retryFire } = useFormControllerRetry();
  const formControllerValue: FormControllerContextValueType<EditMainSettingsSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryEvent,
        retryFire,
        onReset: reset,
      }),
      [retryFire, retryEvent, onSubmit, reset],
    );

  return (
    <FormProvider {...formObject}>
      <MainSettingsContext.Provider value={createVaultData}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
          <SubmitModal
            submitStep={submitStep}
            setModalState={setModalState}
            onClose={handleCancelSubmit}
          />
        </FormControllerContext.Provider>
      </MainSettingsContext.Provider>
    </FormProvider>
  );
};
