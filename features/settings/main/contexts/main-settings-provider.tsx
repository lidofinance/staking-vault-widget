import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { FormController } from 'shared/hook-form/form-controller';

import { EditMainSettingsSchema } from 'features/settings/main/types';
import { useEditMainSettings } from 'features/settings/main/hooks';
import { editMainSettingsSchema } from 'features/settings/main/consts';
import { useVaultInfo } from 'modules/vaults';
import { useMainSettingsData } from './main-settings-data-provider';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { zodResolver } from '@hookform/resolvers/zod';

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
        const confirmExpiryCurrent = confirmExpiry.find(
          (item) => item.type === 'current',
        )?.value;
        const nodeOperatorFeeBPCurrent = nodeOperatorFeeBP.find(
          (item) => item.type === 'current',
        )?.value;

        return {
          defaultAdmins,
          nodeOperatorManagers,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          confirmExpiry: confirmExpiryCurrent!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          nodeOperatorFeeBP: nodeOperatorFeeBPCurrent!,
        };
      }
      //
      return {
        nodeOperatorManagers: [],
        defaultAdmins: [],
        confirmExpiry: 0,
        nodeOperatorFeeBP: 0,
      };
    },
    resolver: zodResolver(editMainSettingsSchema),
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
