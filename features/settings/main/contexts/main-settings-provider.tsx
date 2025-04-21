import {
  FC,
  PropsWithChildren,
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import invariant from 'tiny-invariant';
import { useForm, FormProvider } from 'react-hook-form';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { SubmitMainModal } from 'features/settings/main/components';

import {
  editMainSettingsSchema,
  SubmittingMainFormStepsEnum,
} from 'features/settings/main/consts';
import {
  EditMainSettingsSchema,
  MainSettingsContextValue,
  MainSettingsSubmittingInfo,
} from 'features/settings/main/types';
import { editMainSettingsValidator } from 'features/settings/main/validation';
import { useEditMainSettingsWithDelegation } from 'features/settings/main/hooks';
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
  const [submitStep, setSubmitStep] = useState<MainSettingsSubmittingInfo>(
    () => ({
      step: SubmittingMainFormStepsEnum.edit,
    }),
  );
  const { refetch } = useVaultInfo();

  const { callEditMainSettings } = useEditMainSettingsWithDelegation(async () =>
    setSubmitStep({ step: SubmittingMainFormStepsEnum.submitting }),
  );

  const handleCancelSubmit = useCallback(() => {
    setSubmitStep({ step: SubmittingMainFormStepsEnum.edit });
  }, []);

  const createVaultData = {
    submitStep,
    handleCancelSubmit,
  };

  const formObject = useForm<EditMainSettingsSchema>({
    defaultValues: {
      nodeOperatorManager: [],
      nodeOperatorFeeBP: [],
      confirmExpiry: [],
      defaultAdmin: [],
    },
    resolver: editMainSettingsValidator(editMainSettingsSchema),
    mode: 'all',
  });

  const onSubmit = useCallback(
    async (data: EditMainSettingsSchema): Promise<boolean> => {
      setSubmitStep({ step: SubmittingMainFormStepsEnum.initiate });
      setSubmitStep({ step: SubmittingMainFormStepsEnum.confirming });

      try {
        const response = await callEditMainSettings(data);
        setSubmitStep({ step: SubmittingMainFormStepsEnum.success, response });
        refetch();
      } catch (err) {
        // TODO: handle more type of errors
        setSubmitStep({ step: SubmittingMainFormStepsEnum.reject });
        return false;
      }

      return true;
    },
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
          <SubmitMainModal />
        </FormControllerContext.Provider>
      </MainSettingsContext.Provider>
    </FormProvider>
  );
};
