import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { FormController } from 'shared/hook-form/form-controller';

import {
  useEditTierSettings,
  useVaultTierInfo,
} from 'features/settings/tier/hooks';
import { TierSettingsFormValues } from 'features/settings/tier/types';

// TODO: replace by promisified useForm context
const loadDefaultValues = async (): Promise<TierSettingsFormValues> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        selectedTierId: '0',
        vaultMintingLimit: 1000,
      });
    }, 500);
  });
};

export const TierFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { editTierSettings, retryEvent } = useEditTierSettings();
  const { refetch } = useVaultTierInfo();
  const formObject = useForm<TierSettingsFormValues>({
    defaultValues: loadDefaultValues,
    mode: 'all',
  });

  const onSubmit = useCallback(
    async (data: TierSettingsFormValues): Promise<boolean> => {
      const { result } = await editTierSettings(data);
      await refetch({ cancelRefetch: true, throwOnError: false });

      return result.success;
    },
    [editTierSettings, refetch],
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
