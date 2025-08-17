import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormController } from 'shared/hook-form/form-controller';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { useDappStatus } from 'modules/web3';

import {
  useEditTierSettings,
  useVaultTierInfo,
  VaultTierData,
} from 'features/settings/tier/hooks';
import { TierSettingsFormValues } from 'features/settings/tier/types';
import { tierSettingsFormSchema } from 'features/settings/tier/const';

const prepareDefaultValues = async (
  tierInfo: VaultTierData,
): Promise<TierSettingsFormValues> => {
  const { vault } = tierInfo;

  return {
    selectedTierId: vault.tierId.toString(),
    selectedTierLimit: vault.stETHLimit,
    vaultMintingLimit: vault.stETHLimit,
  };
};

export const TierFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const { editTierSettings, retryEvent } = useEditTierSettings();
  const { refetch, data } = useVaultTierInfo();

  const promisedTierInfo = useAwaiter(data).awaiter;

  const formObject = useForm<TierSettingsFormValues>({
    defaultValues: async () =>
      await promisedTierInfo.then(prepareDefaultValues),
    disabled: !isDappActive,
    context: promisedTierInfo,
    resolver: zodResolver(tierSettingsFormSchema),
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
