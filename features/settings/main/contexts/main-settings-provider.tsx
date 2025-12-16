import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { FormController } from 'shared/hook-form/form-controller';
import { useVault } from 'modules/vaults';
import { useAwaiter } from 'shared/hooks/use-awaiter';

import { useEditMainSettings } from '../hooks';
import { useMainSettingsFormData } from './main-settings-data-provider';
import { mainSettingsFormResolver } from '../consts';
import { prepareDefaultValues } from '../utils';

import type {
  MainSettingFormsValues,
  MainSettingsFormValidatedValues,
  MainSettingsFormData,
} from '../types';

export const MainSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const {
    activeVault,
    invalidateVaultConfig,
    invalidateVaultState,
    refetch: refetchVault,
  } = useVault();
  const { editMainSettings, retryEvent } = useEditMainSettings();
  const { data, refetch } = useMainSettingsFormData();
  const { isPendingDisconnect, isPendingConnect } = activeVault ?? {};

  const promisedSettingsData = useAwaiter(data).awaiter;

  const formObject = useForm<
    MainSettingFormsValues,
    Promise<MainSettingsFormData>,
    MainSettingsFormValidatedValues
  >({
    defaultValues: async () =>
      await promisedSettingsData.then(prepareDefaultValues),
    disabled: !isDappActive || isPendingDisconnect || isPendingConnect,
    resolver: mainSettingsFormResolver,
    context: promisedSettingsData,
    mode: 'all',
  });
  const reset = formObject.reset;

  const onSubmit = useCallback(
    async (data: MainSettingsFormValidatedValues): Promise<boolean> => {
      const { result, isStateChanged } = await editMainSettings(data);

      const [_, __, vaultInfo] = await Promise.all([
        isStateChanged ? invalidateVaultState() : Promise.resolve(),
        invalidateVaultConfig(),
        refetch({ cancelRefetch: true, throwOnError: false }),
        refetchVault({ cancelRefetch: true, throwOnError: false }),
      ]);

      // we reset form anyway because partial success is possible and will invalidate form state
      if (vaultInfo.data) {
        const newDefaultValues = prepareDefaultValues(vaultInfo.data);
        reset(newDefaultValues);
      } else reset();

      return result.success;
    },
    [
      editMainSettings,
      invalidateVaultConfig,
      invalidateVaultState,
      refetch,
      refetchVault,
      reset,
    ],
  );

  return (
    <FormController
      formObject={formObject}
      onSubmit={onSubmit}
      retryEvent={retryEvent}
      afterSubmitResetOptions={false}
    >
      {children}
    </FormController>
  );
};
