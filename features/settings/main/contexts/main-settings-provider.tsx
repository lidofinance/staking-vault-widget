import { type FC, type PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { trackEvent } from '@lidofinance/analytics-matomo';

import { useDappStatus } from 'modules/web3';
import { FormController, useDisableForm } from 'shared/hook-form';
import { useVault } from 'modules/vaults';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { MATOMO_CLICK_EVENTS } from 'consts/matomo-click-events';

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
    invalidateVaultConfig,
    invalidateVaultState,
    refetch: refetchVault,
  } = useVault();
  const { editMainSettings, retryEvent } = useEditMainSettings();
  const { data, refetch } = useMainSettingsFormData();
  const disabled = useDisableForm();

  const promisedSettingsData = useAwaiter(data).awaiter;

  const formObject = useForm<
    MainSettingFormsValues,
    Promise<MainSettingsFormData>,
    MainSettingsFormValidatedValues
  >({
    defaultValues: async () =>
      await promisedSettingsData.then(prepareDefaultValues),
    disabled: !isDappActive || disabled,
    resolver: mainSettingsFormResolver,
    context: promisedSettingsData,
    mode: 'all',
  });
  const reset = formObject.reset;

  const onSubmit = useCallback(
    async (data: MainSettingsFormValidatedValues): Promise<boolean> => {
      trackEvent(...MATOMO_CLICK_EVENTS.clickSettingsSubmitMainSettingsTab);
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
