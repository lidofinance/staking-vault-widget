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
} from 'features/settings/main/types';
import { useEditMainSettings } from 'features/settings/main/hooks';
import { validateFormWithZod } from 'utils/validate-form-value';
import { editMainSettingsSchema } from 'features/settings/main/consts';
import { useVaultInfo } from '../../../overview/contexts';

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
  const { refetch } = useVaultInfo();

  const { callEditMainSettings } = useEditMainSettings();
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

  const onSubmit = useCallback(
    async (data: EditMainSettingsSchema): Promise<boolean> => {
      try {
        setModalState({ step: SubmitStepEnum.initiate });
        await callEditMainSettings(data, setModalState, abortControllerRef);
        setModalState({ step: SubmitStepEnum.success });
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
        return true;
      } finally {
        setTimeout(refetch, 100);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callEditMainSettings, submitStep, refetch],
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
