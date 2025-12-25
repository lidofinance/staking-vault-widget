import { FC, PropsWithChildren, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { FormController } from 'shared/hook-form/form-controller';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { useDappStatus } from 'modules/web3';
import {
  useVault,
  useVaultConfirmingRoles,
  useVaultPermission,
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
  const tierMintingCapacityStEth = tier.shareLimitStETH - tier.liabilityStETH;

  return {
    selectedTierId: vault.tierId.toString(),
    selectedTierLimit: tierMintingCapacityStEth,
    vaultMintingLimit: vault.stETHLimit,
  };
};

export const TierFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const { activeVault, refetch } = useVault();
  const { editTierSettings, retryEvent } = useEditTierSettings();
  const { data } = useVaultTierInfo();
  const { isNodeOperator, hasAdmin } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('vaultConfiguration');
  const promisedTierInfo = useAwaiter(data).awaiter;
  const isDisabledByRoles = !(isNodeOperator || hasAdmin || hasPermission);
  const { isPendingDisconnect, isPendingConnect } = activeVault ?? {};

  const formObject = useForm<TierSettingsFormValues>({
    defaultValues: async () =>
      await promisedTierInfo.then(prepareDefaultValues),
    disabled:
      !isDappActive ||
      isPendingDisconnect ||
      isPendingConnect ||
      isDisabledByRoles,
    context: promisedTierInfo,
    resolver: tierSettingsFormResolver,
    mode: 'onChange',
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
    >
      {children}
    </FormController>
  );
};
