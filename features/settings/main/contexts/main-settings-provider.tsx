import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { FormController } from 'shared/hook-form/form-controller';
import { useEditMainSettings } from 'features/settings/main/hooks';
import { useMainSettingsData } from './main-settings-data-provider';

import { EditMainSettingsSchema } from 'features/settings/main/types';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { zodResolver } from '@hookform/resolvers/zod';
import { editMainSettingsSchema } from 'features/settings/main/consts';

export const MainSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDappActive } = useDappStatus();
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
          confirmExpiry: confirmExpiryCurrent ?? 0,
          confirmExpiryDefault: confirmExpiryCurrent ?? 0,
          nodeOperatorFeeBP: nodeOperatorFeeBPCurrent ?? 0,
          nodeOperatorFeeBPDefault: nodeOperatorFeeBPCurrent ?? 0,
        };
      }
      //
      return {
        nodeOperatorManagers: [],
        defaultAdmins: [],
        confirmExpiry: 0,
        confirmExpiryDefault: 0,
        nodeOperatorFeeBP: 0,
        nodeOperatorFeeBPDefault: 0,
      };
    },
    disabled: !isDappActive,
    // @ts-expect-error TODO: fix zod Address validation type
    resolver: zodResolver(editMainSettingsSchema),
    mode: 'all',
  });

  const onSubmit = useCallback(
    async (data: EditMainSettingsSchema): Promise<boolean> => {
      const { success } = await editMainSettings(data);

      return success;
    },
    [editMainSettings],
  );

  return (
    <FormProvider {...formObject}>
      <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
        {children}
      </FormController>
    </FormProvider>
  );
};
