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
import { useDappStatus } from 'modules/web3';
import { usePublicClient } from 'wagmi';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { SubmitPermissionsModal } from 'features/settings/permissions/components';

import { editVaultValidator } from 'features/settings/permissions/validation';
import {
  ToggleValue,
  PermissionToggleEnum,
  editPermissionsSchema,
  SubmitPermissionsStepEnum,
  defaultPermissionsValues,
} from 'features/settings/permissions/consts';
import {
  EditPermissionsSchema,
  PermissionsSettingsContextValue,
  PermissionsSubmittingInfo,
} from 'features/settings/permissions/types';
import {
  useEditPermissionsWithDelegation,
  simulateEditPermissionsWithDelegation,
} from 'features/settings/permissions/hooks';
import { useVaultInfo } from 'features/overview/contexts';
import { collectFormValuesToRpc } from 'features/settings/permissions/utils';

const PermissionsSettingsContext =
  createContext<PermissionsSettingsContextValue | null>(null);
PermissionsSettingsContext.displayName = 'PermissionsSettingsContext';

export const usePermissionsSettingsData = () => {
  const value = useContext(PermissionsSettingsContext);
  invariant(
    value,
    'usePermissionsSettings was used outside the PermissionsSettingsContext provider',
  );

  return value;
};

export const PermissionsSettingsProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const publicClient = usePublicClient();
  const { address } = useDappStatus();
  const [permissionsView, setPermissionsView] = useState<ToggleValue>(
    () => PermissionToggleEnum.byPermission,
  );
  const { activeVault } = useVaultInfo();

  const [submitStep, setSubmitStep] = useState<PermissionsSubmittingInfo>({
    step: SubmitPermissionsStepEnum.edit,
  });
  const { callEditPermissions } = useEditPermissionsWithDelegation(() =>
    setSubmitStep({ step: SubmitPermissionsStepEnum.submitting }),
  );

  const handleSetPermissionsView = useCallback((value: ToggleValue) => {
    setPermissionsView(value);
  }, []);

  const handleCancelSubmit = useCallback(() => {
    setSubmitStep({ step: SubmitPermissionsStepEnum.edit });
  }, []);

  const editPermissionsData = useMemo(
    () => ({
      permissionsView,
      submitStep,
      handleSetPermissionsView,
      handleCancelSubmit,
    }),
    [permissionsView, submitStep, handleSetPermissionsView, handleCancelSubmit],
  );

  const formObject = useForm<EditPermissionsSchema>({
    defaultValues: defaultPermissionsValues,
    resolver: editVaultValidator(editPermissionsSchema),
    mode: 'all',
  });

  const onSubmit = useCallback(
    async (data: EditPermissionsSchema): Promise<boolean> => {
      setSubmitStep({ step: SubmitPermissionsStepEnum.initiate });

      const payload = collectFormValuesToRpc(data);
      if (activeVault?.owner && publicClient && address) {
        try {
          await simulateEditPermissionsWithDelegation({
            permissions: payload,
            publicClient: publicClient,
            delegationAddress: activeVault?.owner,
            account: address,
          });
        } catch (err) {
          setSubmitStep({ step: SubmitPermissionsStepEnum.error });
          return false;
        }
      } else {
        return false;
      }

      setSubmitStep({ step: SubmitPermissionsStepEnum.confirming });
      try {
        const response = await callEditPermissions(payload);
        setSubmitStep({
          step: SubmitPermissionsStepEnum.success,
          tx: response,
        });
      } catch (err) {
        // TODO: handle more type of errors
        setSubmitStep({ step: SubmitPermissionsStepEnum.reject });

        return false;
      }

      return true;
    },
    [callEditPermissions, address, publicClient, activeVault?.owner],
  );

  const { retryEvent, retryFire } = useFormControllerRetry();
  const formControllerValue: FormControllerContextValueType<EditPermissionsSchema> =
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
      <PermissionsSettingsContext.Provider value={editPermissionsData}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
          <SubmitPermissionsModal />
        </FormControllerContext.Provider>
      </PermissionsSettingsContext.Provider>
    </FormProvider>
  );
};
