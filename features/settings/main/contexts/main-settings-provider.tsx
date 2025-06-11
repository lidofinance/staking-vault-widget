import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { FormController } from 'shared/hook-form/form-controller';
import { useAwaiter } from 'shared/hooks/use-awaiter';

import { useEditMainSettings } from 'features/settings/main/hooks';
import { useMainSettingsData } from './main-settings-data-provider';

import { mainSettingsFormResolver } from 'features/settings/main/consts';
import { EditMainSettingsSchema } from 'features/settings/main/types';
import { prepareDefaultValues, formatSettingsValues } from '../utils';
import { VaultInfo } from 'types';

export const MainSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const { editMainSettings, retryEvent } = useEditMainSettings();
  const settingsData = useMainSettingsData();
  const promisedSettingsData = useAwaiter(settingsData);

  const formObject = useForm<EditMainSettingsSchema>({
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
        nodeOperatorFeeBPValue,
        defaultAdmins,
        nodeOperatorManagers,
      } = formatSettingsValues(vaultInfo);

      const resetFields = {
        defaultAdmins,
        nodeOperatorManagers,
        confirmExpiry: confirmExpiryValue,
        nodeOperatorFeeBP: nodeOperatorFeeBPValue,
      };

      // TODO: think about moving reset to the form controller
      reset(resetFields);
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
    <FormProvider {...formObject}>
      <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
        {children}
      </FormController>
    </FormProvider>
  );
};
