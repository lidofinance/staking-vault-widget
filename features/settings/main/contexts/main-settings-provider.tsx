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
  const { invalidateVaultConfig } = useVault();
  const { editMainSettings, retryEvent } = useEditMainSettings();
  const { data, refetch } = useMainSettingsFormData();

  const promisedSettingsData = useAwaiter(data).awaiter;

  const formObject = useForm<
    MainSettingFormsValues,
    Promise<MainSettingsFormData>,
    MainSettingsFormValidatedValues
  >({
    defaultValues: async () =>
      await promisedSettingsData.then(prepareDefaultValues),
    disabled: !isDappActive,
    resolver: mainSettingsFormResolver,
    context: promisedSettingsData,
    mode: 'all',
  });
  const reset = formObject.reset;

  const onSubmit = useCallback(
    async (data: MainSettingsFormValidatedValues): Promise<boolean> => {
      const { result } = await editMainSettings(data);

      const [vaultInfo] = await Promise.all([
        refetch({ cancelRefetch: true, throwOnError: false }),
        invalidateVaultConfig(),
      ]);

      if (result && vaultInfo.data) {
        reset(prepareDefaultValues(vaultInfo.data));
      } else reset();

      return result.success;
    },
    [editMainSettings, invalidateVaultConfig, refetch, reset],
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
