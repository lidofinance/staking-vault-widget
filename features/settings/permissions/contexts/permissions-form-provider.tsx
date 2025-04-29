import {
  FC,
  PropsWithChildren,
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useDappStatus } from 'modules/web3';
import { usePublicClient } from 'wagmi';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { validateFormWithZod } from 'utils/validate-form-value';
import { editPermissionsSchema } from 'features/settings/permissions/consts';
import {
  EditPermissionsSchema,
  FieldSchema,
} from 'features/settings/permissions/types';
import {
  useEditPermissionsWithDashboard,
  simulateEditPermissionsWithDashboard,
} from 'features/settings/permissions/hooks';
import { useVaultInfo } from 'modules/vaults';
import { collectFormValuesToRpc } from 'features/settings/permissions/utils';
import { usePermissionsData } from './permissions-data-provider';
import { SubmitModal } from 'shared/components';
import { SubmitPayload, SubmitStepEnum } from 'shared/components/submit-modal';

export const PermissionsFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const publicClient = usePublicClient();
  const { address } = useDappStatus();
  const { activeVault } = useVaultInfo();
  const { callEditPermissions } = useEditPermissionsWithDashboard();
  const { rolesList, refetch } = usePermissionsData();
  const [submitStep, setSubmitStep] = useState<SubmitPayload>(() => ({
    step: SubmitStepEnum.edit,
  }));
  const abortControllerRef = useRef(new AbortController());
  const handleCancelSubmit = useCallback(() => {
    abortControllerRef.current.abort();
    setSubmitStep({ step: SubmitStepEnum.edit });
  }, []);

  const setModalState = useCallback((submitStep: SubmitPayload) => {
    setSubmitStep(submitStep);
  }, []);

  const formObject = useForm<EditPermissionsSchema>({
    resolver: validateFormWithZod(editPermissionsSchema),
    mode: 'all',
  });

  useEffect(() => {
    if (rolesList.length > 0) {
      rolesList.forEach((role) => {
        const values = role.addressList.map(
          (address) =>
            ({
              account: address,
              group: 'settled',
              state: 'display',
            }) as FieldSchema,
        );
        formObject.setValue(`${role.permissionName}` as const, values);
      });
    }
  }, [formObject, rolesList]);

  const onSubmit = useCallback(
    async (data: EditPermissionsSchema): Promise<boolean> => {
      const payload = collectFormValuesToRpc(data);
      if (activeVault?.owner && publicClient && address) {
        setModalState({ step: SubmitStepEnum.initiate });
        try {
          await simulateEditPermissionsWithDashboard({
            payload: payload,
            publicClient: publicClient,
            delegationAddress: activeVault?.owner,
            account: address,
          });
        } catch (err) {
          setModalState({ step: SubmitStepEnum.error });
          return false;
        }
      } else {
        return false;
      }

      try {
        await callEditPermissions(payload, setModalState, abortControllerRef);
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

        return false;
      } finally {
        setTimeout(refetch, 100);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callEditPermissions, address, publicClient, activeVault?.owner, refetch],
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
      <FormControllerContext.Provider value={formControllerValue}>
        <FormController>{children}</FormController>
        <SubmitModal
          submitStep={submitStep}
          setModalState={setModalState}
          onClose={handleCancelSubmit}
        />
      </FormControllerContext.Provider>
    </FormProvider>
  );
};
