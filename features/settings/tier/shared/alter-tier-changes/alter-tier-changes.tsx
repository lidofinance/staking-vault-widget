import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import type { VaultTierData } from 'features/settings/tier/hooks';
import { ALTER_TIER_LABELS } from 'features/settings/tier/const';

type AlterTierChangesProps = {
  alterTierList: VaultTierData['alterTierList'];
  dataTestId?: string;
};

export const AlterTierChanges: FC<AlterTierChangesProps> = ({
  alterTierList,
  dataTestId,
}) => {
  return (
    <>
      {alterTierList.map(({ name, prev, next }) => (
        <Text
          key={name}
          size="xxs"
          data-testid={dataTestId ? `${dataTestId}-${name}` : undefined}
        >
          The {ALTER_TIER_LABELS[name]} for your current tier has been updated (
          {prev} → {next}).
        </Text>
      ))}
    </>
  );
};
