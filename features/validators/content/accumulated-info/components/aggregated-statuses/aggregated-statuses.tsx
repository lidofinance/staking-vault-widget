import { useMemo } from 'react';
import { Divider } from '@lidofinance/lido-ui';

import type { ValidatorStatus } from 'modules/vaults';

import { StatusChip } from 'features/validators/shared';
import { useValidators } from 'features/validators/contexts';

import { StatusesContainer } from './styles';

export const AggregateStatuses = () => {
  const { meta } = useValidators();
  const dataForRender = useMemo(() => {
    const entries = Object.entries(meta?.byStatus ?? {}) as [
      ValidatorStatus,
      number,
    ][];

    return entries.map(([status, value]) => ({
      status,
      value,
    }));
  }, [meta?.byStatus]);

  if (dataForRender.length === 0) {
    return null;
  }

  return (
    <>
      <Divider />
      <StatusesContainer>
        {dataForRender.map(({ value, status }) => (
          <StatusChip key={status} value={value} status={status} />
        ))}
      </StatusesContainer>
    </>
  );
};
