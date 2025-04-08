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

const MainSettingsContext = createContext<MainSettingsContextValue | null>(
  null,
);
MainSettingsContext.displayName = ' MainSettingsContext';

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
  const { callEditMainSettings } = useEditMainSettingsWithDelegation(() =>
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
      nodeOperator: '',
      nodeOperatorManager: '',
      nodeOperatorFeeBP: 5,
      confirmExpiry: 36,
      defaultAdmin: '',
    },
    resolver: editMainSettingsValidator(editMainSettingsSchema),
    mode: 'all',
  });

  const onSubmit = useCallback(
    async (data: EditMainSettingsSchema): Promise<boolean> => {
      setSubmitStep({ step: SubmittingMainFormStepsEnum.initiate });
      try {
        // await simulateCreateVault(core.rpcProvider, address, data);
      } catch (err) {
        setSubmitStep({ step: SubmittingMainFormStepsEnum.error });
        return false;
      }

      setSubmitStep({ step: SubmittingMainFormStepsEnum.confirming });
      try {
        await callEditMainSettings(data);
        setSubmitStep({ step: SubmittingMainFormStepsEnum.success });
      } catch (err) {
        // TODO: handle more type of errors
        setSubmitStep({ step: SubmittingMainFormStepsEnum.reject });

        return false;
      }

      return true;
    },
    [callEditMainSettings],
  );

  const { retryEvent, retryFire } = useFormControllerRetry();
  const formControllerValue: FormControllerContextValueType<EditMainSettingsSchema> =
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
      <MainSettingsContext.Provider value={createVaultData}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
          <SubmitMainModal />
        </FormControllerContext.Provider>
      </MainSettingsContext.Provider>
    </FormProvider>
  );
};
