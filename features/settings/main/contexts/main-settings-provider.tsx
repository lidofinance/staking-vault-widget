import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { FormController } from 'shared/hook-form/form-controller';

import { EditMainSettingsSchema } from 'features/settings/main/types';
import { useEditMainSettings } from 'features/settings/main/hooks';
import { validateFormWithZod } from 'utils/validate-form-value';
import { editMainSettingsSchema } from 'features/settings/main/consts';
import { useVaultInfo } from 'modules/vaults';
import { useMainSettingsData } from './main-settings-data-provider';
import { useAwaiter } from 'shared/hooks/use-awaiter';

export const MainSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { refetch } = useVaultInfo();
  const { editMainSettings, retryEvent } = useEditMainSettings();
  const settingsData = useMainSettingsData();
  const promisedSettingsData = useAwaiter(settingsData);

  const formObject = useForm<EditMainSettingsSchema>({
    defaultValues: async () => {
      const settingsData = await promisedSettingsData.awaiter;
      if (settingsData) {
        const {
          confirmExpiry,
          defaultAdmins,
          nodeOperatorFeeBP,
          nodeOperatorManagers,
        } = settingsData;
        return {
          defaultAdmins,
          nodeOperatorManagers,
          confirmExpiry: {
            options: confirmExpiry,
            selectedIndex: confirmExpiry
              .findIndex((item) => item.type === 'current')
              .toString(),
          },
          nodeOperatorFeeBP: {
            options: nodeOperatorFeeBP,
            selectedIndex: nodeOperatorFeeBP
              .findIndex((item) => item.type === 'current')
              .toString(),
          },
        };
      }
      //
      return {
        nodeOperatorManagers: [],
        defaultAdmins: [],
        confirmExpiry: { options: [], selectedIndex: 0 },
        nodeOperatorFeeBP: { options: [], selectedIndex: 0 },
      };
    },
    resolver: validateFormWithZod(editMainSettingsSchema),
    mode: 'all',
  });

  const onSubmit = useCallback(
    async (data: EditMainSettingsSchema): Promise<boolean> => {
      const { success } = await editMainSettings(data);

      // refetch even when error because some transactions may be successful
      // or reverted due to state change
      await refetch({ cancelRefetch: true, throwOnError: true });

      return success;
    },
    [editMainSettings, refetch],
  );

  return (
    <FormProvider {...formObject}>
      <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
        {children}
      </FormController>
    </FormProvider>
  );
};
