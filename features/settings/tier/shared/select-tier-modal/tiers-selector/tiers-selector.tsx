import { FC, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { TierBaseInfo } from 'features/settings/tier/shared/tier-base-info';
import { Tier } from 'features/settings/tier/hooks/types';
import { RadioSelector } from '../radio-selector';
import { useTierData } from 'features/settings/tier/contexts';

type TiersSelectorProps = {
  tiers: Tier[] | undefined;
};

export const TiersSelector: FC<TiersSelectorProps> = ({ tiers = [] }) => {
  const { register, setValue, watch, trigger } = useFormContext();
  const { values, setSelectedTier } = useTierData();
  const selectedTierId = watch('selectedTierId');

  useEffect(() => {
    const tier = tiers.find((tier) => tier.id.toString() === selectedTierId);
    if (tier) {
      // Update both values first to avoid validation race, then validate once
      setValue('selectedTierLimit', tier.shareLimitStETH, {
        shouldDirty: true,
        shouldValidate: false,
      });
      setValue('vaultMintingLimit', tier.shareLimitStETH, {
        shouldDirty: true,
        shouldValidate: false,
      });
      void trigger(['vaultMintingLimit', 'selectedTierLimit']);

      setSelectedTier(tier);
    }
  }, [selectedTierId, setSelectedTier, setValue, tiers, trigger]);

  if (tiers.length === 0) return null;
  if (selectedTierId === null) return null;

  return (
    <>
      {tiers.map((tier) => {
        const isActive = values?.vault.tierId === tier.id;
        return (
          <RadioSelector
            key={tier.tierName}
            tierIdString={tier.id.toString()}
            {...register('selectedTierId')}
          >
            <TierBaseInfo
              tierName={tier.tierName}
              reserveRatio={tier.reserveRatioBP}
              tierStETHLimit={tier.shareLimitStETH}
              liabilityStETH={tier.liabilityStETH}
              isActive={isActive}
            />
          </RadioSelector>
        );
      })}
    </>
  );
};
