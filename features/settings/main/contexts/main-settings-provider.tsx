import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDappStatus } from 'modules/web3';
import { FormController } from 'shared/hook-form/form-controller';
import { useAwaiter } from 'shared/hooks/use-awaiter';

import { useEditMainSettings } from 'features/settings/main/hooks';
import { useMainSettingsData } from './main-settings-data-provider';

import { editMainSettingsSchema } from 'features/settings/main/consts';
import { EditMainSettingsSchema } from 'features/settings/main/types';
import { prepareDefaultValues } from '../utils';

export const MainSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const { editMainSettings, retryEvent } = useEditMainSettings();
  const settingsData = useMainSettingsData();
  const promisedSettingsData = useAwaiter(settingsData);

  const formObject = useForm<EditMainSettingsSchema>({
    defaultValues: prepareDefaultValues(promisedSettingsData.awaiter),
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
