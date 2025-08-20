import { FC, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { TierBaseInfo } from 'features/settings/tier/shared/tier-base-info';
import { Tier } from 'features/settings/tier/hooks/types';
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
      setValue(
        'vaultMintingLimit',
        tier.shareLimitStETH - tier.liabilityStETH,
        {
          shouldDirty: true,
          shouldValidate: false,
        },
      );
      void trigger(['vaultMintingLimit', 'selectedTierLimit']);

      setSelectedTier(tier);
    }
  }, [selectedTierId, setSelectedTier, setValue, tiers, trigger]);

  if (tiers.length === 0) return null;
  if (selectedTierId === null) return null;

  const selectedTierIdField = register('selectedTierId');

  return (
    <>
      {tiers.map((tier) => {
        const isActive = values?.vault.tierId === tier.id;
        const showSelector =
          (values?.vault.liabilityStETH ?? 0n) <=
          tier.shareLimitStETH - tier.liabilityStETH;

        return (
          <RadioSelector
            key={tier.tierName}
            tierIdString={tier.id.toString()}
            showSelector={showSelector}
            {...selectedTierIdField}
            onChange={(e) => {
              void selectedTierIdField.onChange(e).then(closeModal);
            }}
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
