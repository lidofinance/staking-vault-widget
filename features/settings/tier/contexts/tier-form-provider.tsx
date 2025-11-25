import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { FormController } from 'shared/hook-form/form-controller';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { useDappStatus } from 'modules/web3';
import {
  useNodeOperatorTiersInfo,
  useVault,
  useVaultTierInfo,
  type VaultTierData,
} from 'modules/vaults';

import { useEditTierSettings } from 'features/settings/tier/hooks';
import { tierSettingsFormResolver } from 'features/settings/tier/const';
import type { TierSettingsFormValues } from 'features/settings/tier/types';

const prepareDefaultValues = async (
  tierInfo: VaultTierData,
): Promise<TierSettingsFormValues> => {
  const { vault, tier } = tierInfo;

  const tierMintingCapacity = tier.shareLimitStETH - tier.liabilityStETH;
  const vaultMintingLimit =
    vault.stETHLimit > tierMintingCapacity
      ? tierMintingCapacity
      : vault.stETHLimit;

  return {
    selectedTierId: vault.tierId.toString(),
    selectedTierLimit: vault.stETHLimit,
    vaultMintingLimit,
  };
};

export const TierFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const { activeVault } = useVault();
  const { editTierSettings, retryEvent } = useEditTierSettings();
  const { refetch, data } = useVaultTierInfo();
  const { refetch: refetchNOTiers } = useNodeOperatorTiersInfo();
  const promisedTierInfo = useAwaiter(data).awaiter;

  const { isPendingDisconnect, isPendingConnect } = activeVault ?? {};

  const formObject = useForm<TierSettingsFormValues>({
    defaultValues: async () =>
      await promisedTierInfo.then(prepareDefaultValues),
    disabled: !isDappActive || isPendingDisconnect || isPendingConnect,
    context: promisedTierInfo,
    resolver: tierSettingsFormResolver,
    mode: 'all',
  });

  const onSubmit = useCallback(
    async (data: TierSettingsFormValues): Promise<boolean> => {
      const { result } = await editTierSettings(data);
      await Promise.all([
        refetch({ cancelRefetch: true, throwOnError: false }),
        refetchNOTiers({ cancelRefetch: true, throwOnError: false }),
      ]);

      return result.success;
    },
    [editTierSettings, refetch, refetchNOTiers],
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
