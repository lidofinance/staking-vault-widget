import { type ChangeEvent, type FC, useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { Tier } from 'modules/vaults';

import { TierBaseInfo } from 'features/settings/tier/shared/tier-base-info';
import { RadioSelector } from '../radio-selector';
import { useTierData } from 'features/settings/tier/contexts';

type TiersSelectorProps = {
  tiers: Tier[] | undefined;
  closeModal: () => void;
};

export const TiersSelector: FC<TiersSelectorProps> = ({
  tiers = [],
  closeModal,
}) => {
  const { setValue, trigger } = useFormContext();
  const { field } = useController({ name: 'selectedTierId' });
  const { values, setSelectedTier } = useTierData();

  const onChangeTier = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!values) return;
      const selectedTierId = e.currentTarget.value;
      const tier = tiers.find((tier) => tier.id.toString() === selectedTierId);
      if (tier) {
        // Update both values first to avoid validation race, then validate once
        setValue('selectedTierLimit', tier.shareLimitStETH, {
          shouldDirty: true,
          shouldValidate: false,
        });

        if (values.vault.tierId.toString() === selectedTierId) {
          setValue('vaultMintingLimit', values.vault.stETHLimit, {
            shouldDirty: false,
            shouldValidate: false,
          });

          void trigger(['selectedTierLimit']);
        } else {
          setValue('vaultMintingLimit', tier.shareLimitStETH, {
            shouldDirty: true,
            shouldValidate: true,
          });

          void trigger(['vaultMintingLimit', 'selectedTierLimit']);
        }

        setSelectedTier(tier);
      }

      void (field.onChange(e) as unknown as Promise<void>).then(closeModal);
    },
    [field, setSelectedTier, setValue, tiers, trigger, closeModal, values],
  );

  if (tiers.length === 0) return null;
  if (field.value === null) return null;

  const { name, value, ref } = field;

  return (
    <>
      {tiers.map((tier) => {
        const isActive = values?.vault.tierId === tier.id;
        const showSelector =
          (values?.vault.liabilityStETH ?? 0n) <=
            tier.shareLimitStETH - tier.liabilityStETH || isActive;

        return (
          <RadioSelector
            key={tier.tierName}
            tierIdString={tier.id.toString()}
            showSelector={showSelector}
            name={name}
            currentValue={value}
            ref={ref}
            onChange={onChangeTier}
            data-testid={`tierId-${tier.id.toString()}`}
          >
            <TierBaseInfo tier={tier} isActive={isActive} />
          </RadioSelector>
        );
      })}
    </>
  );
};
