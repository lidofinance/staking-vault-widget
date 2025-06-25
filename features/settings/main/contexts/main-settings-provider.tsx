import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { FormController } from 'shared/hook-form/form-controller';
import { useVault } from 'modules/vaults';
import { useAwaiter } from 'shared/hooks/use-awaiter';

import { useEditMainSettings } from '../hooks';
import { useMainSettingsData } from './main-settings-data-provider';
import { mainSettingsFormResolver } from '../consts';
import { prepareDefaultValues, formatSettingsValues } from '../utils';
import type { EditMainSettingsSchema, MainSettingsFormData } from '../types';

export const MainSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const { invalidateVaultConfig } = useVault();
  const { editMainSettings, retryEvent } = useEditMainSettings();
  const { values, refetch } = useMainSettingsData();

  const promisedSettingsData = useAwaiter(values);

  const formObject = useForm<
    EditMainSettingsSchema,
    MainSettingsFormData | null,
    EditMainSettingsSchema
  >({
    defaultValues: prepareDefaultValues(promisedSettingsData.awaiter),
    disabled: !isDappActive,
    // @ts-expect-error zodResolver is not compatible with react-hook-form
    resolver: mainSettingsFormResolver,
    context: values,
    mode: 'all',
  });
  const reset = formObject.reset;

  const onSubmit = useCallback(
    async (data: EditMainSettingsSchema): Promise<boolean> => {
      const { result } = await editMainSettings(data);

      const [vaultInfo] = await Promise.all([
        refetch({ cancelRefetch: true, throwOnError: false }),
        invalidateVaultConfig(),
      ]);

      if (result) {
        if (vaultInfo.data) {
          const {
            confirmExpiryValue,
            nodeOperatorFeeRateValue,
            defaultAdmins,
            nodeOperatorManagers,
            nodeOperatorFeeRecipient,
          } = formatSettingsValues(vaultInfo.data);

          // TODO: think about moving reset to the form controller
          reset({
            defaultAdmins,
            nodeOperatorManagers,
            confirmExpiry: confirmExpiryValue,
            nodeOperatorFeeRate: nodeOperatorFeeRateValue,
            nodeOperatorFeeRecipient: nodeOperatorFeeRecipient,
          });
        } else reset();
      }

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
