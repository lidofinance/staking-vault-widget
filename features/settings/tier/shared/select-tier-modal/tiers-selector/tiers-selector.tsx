import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { TierBaseInfo } from 'features/settings/tier/shared/tier-base-info';
import { Tier } from 'features/settings/tier/hooks';
import { RadioSelector } from '../radio-selector';

type TiersSelectorProps = {
  tiers: Tier[] | undefined;
};

export const TiersSelector: FC<TiersSelectorProps> = ({ tiers = [] }) => {
  const { register } = useFormContext();
  if (tiers.length === 0) return null;

  // TODO: get data from useNodeOperatorTiersInfo
  const tierStETHLimit = 10000n * 10n ** 18n;
  const liabilityStETH = 500n * 10n ** 18n;

  return (
    <div>
      {tiers.map((tier) => {
        return (
          <TierBaseInfo
            key={tier.tierName}
            tierName={tier.tierName}
            reserveRatio={'20%'}
            tierStETHLimit={tierStETHLimit.toString()}
            liabilityStETH={liabilityStETH.toString()}
          >
            <RadioSelector
              tierIdString={tier.id.toString()}
              {...register('selectedTierId')}
            />
          </TierBaseInfo>
        );
      })}
    </div>
  );
};
