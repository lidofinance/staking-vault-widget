import { type FC, type PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { useDappStatus, useLidoSDK } from 'modules/web3';
import { FormController, useDisableForm } from 'shared/hook-form';
import { useVault } from 'modules/vaults';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

import { useEditMainSettings } from '../hooks';
import { useMainSettingsFormData } from './main-settings-data-provider';
import { mainSettingsFormResolver } from '../consts';
import { getPendingFormValues, prepareDefaultValues } from '../utils';

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
  const { getLatestTxBlock } = useLidoSDK();
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
  const { reset, setValue } = formObject;

  const onSubmit = useCallback(
    async (data: MainSettingsFormValidatedValues): Promise<boolean> => {
      trackMatomoEvent(
        MATOMO_CLICK_EVENTS_TYPES.clickSettingsSubmitMainSettingsTab,
      );
      const { result, isStateChanged } = await editMainSettings(data);

      const [_, __, vaultInfo] = await Promise.all([
        isStateChanged ? invalidateVaultState() : Promise.resolve(),
        invalidateVaultConfig(),
        refetch({ cancelRefetch: true, throwOnError: false }),
        refetchVault({ cancelRefetch: true, throwOnError: false }),
      ]);

      // we reset form anyway because partial success is possible and will invalidate form state
      // restore pending changes only from data read after the latest tx, otherwise applied txs would be resent
      if (
        vaultInfo.isSuccess &&
        vaultInfo.data.blockNumber >= (getLatestTxBlock() ?? 0n)
      ) {
        const newDefaultValues = prepareDefaultValues(vaultInfo.data);
        reset(newDefaultValues);
        // restore changes that are not applied yet, so retry continues from the remaining txs
        const pending = getPendingFormValues(vaultInfo.data, data);
        (
          Object.entries(pending) as [
            keyof MainSettingFormsValues,
            MainSettingFormsValues[keyof MainSettingFormsValues],
          ][]
        ).forEach(([key, value]) =>
          setValue(key, value, { shouldDirty: true, shouldValidate: true }),
        );
      } else reset();

      return result.success;
    },
    [
      editMainSettings,
      getLatestTxBlock,
      invalidateVaultConfig,
      invalidateVaultState,
      refetch,
      refetchVault,
      reset,
      setValue,
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
