import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { FormController } from 'shared/hook-form/form-controller';
import { useAwaiter } from 'shared/hooks/use-awaiter';

import { useEditMainSettings } from 'features/settings/main/hooks';
import { useMainSettingsData } from './main-settings-data-provider';

import { mainSettingsFormResolver } from 'features/settings/main/consts';

import { prepareDefaultValues, formatSettingsValues } from '../utils';
import type {
  EditMainSettingsSchema,
  MainSettingsDataContextValue,
} from 'features/settings/main/types';
import type { VaultInfo } from 'types';

export const MainSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const { editMainSettings, retryEvent } = useEditMainSettings();
  const settingsData = useMainSettingsData();
  const promisedSettingsData = useAwaiter(settingsData);

  const formObject = useForm<
    EditMainSettingsSchema,
    MainSettingsDataContextValue | null,
    EditMainSettingsSchema
  >({
    defaultValues: prepareDefaultValues(promisedSettingsData.awaiter),
    disabled: !isDappActive,
    // @ts-expect-error TODO: fix zod Address validation type
    resolver: mainSettingsFormResolver,
    context: settingsData,
    mode: 'all',
  });
  const reset = formObject.reset;

  const resetFields = useCallback(
    (vaultInfo: VaultInfo) => {
      const {
        confirmExpiryValue,
        nodeOperatorFeeRateValue,
        defaultAdmins,
        nodeOperatorManagers,
        nodeOperatorFeeRecipient,
      } = formatSettingsValues(vaultInfo);

      // TODO: think about moving reset to the form controller
      reset({
        defaultAdmins,
        nodeOperatorManagers,
        confirmExpiry: confirmExpiryValue,
        nodeOperatorFeeRate: nodeOperatorFeeRateValue,
        nodeOperatorFeeRecipient: nodeOperatorFeeRecipient,
      });
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: EditMainSettingsSchema): Promise<boolean> => {
      const { result, vaultInfo } = await editMainSettings(data);

      if (result.success && vaultInfo.data) resetFields(vaultInfo.data);

      return result.success;
    },
    [editMainSettings, resetFields],
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
