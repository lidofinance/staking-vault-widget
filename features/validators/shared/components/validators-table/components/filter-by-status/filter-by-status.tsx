import { type FC, useMemo, useCallback } from 'react';

import { Select, Option } from '@lidofinance/lido-ui';

import { ValidatorStatus } from 'modules/vaults';

import { useValidators } from 'features/validators/contexts';

type FilterByStatusProps = {
  dataTestId: string;
};

export const FilterByStatus: FC<FilterByStatusProps> = ({ dataTestId }) => {
  const { meta, setFilterByStatus } = useValidators();

  const statuses = useMemo(
    () => Object.keys(meta?.byStatus ?? {}) as ValidatorStatus[],
    [meta?.byStatus],
  );

  const onChange = useCallback(
    (option: string | number) => setFilterByStatus(option as ValidatorStatus),
    [setFilterByStatus],
  );

  return (
    <Select
      onChange={onChange}
      placeholder="Status"
      value={undefined}
      data-testid={`${dataTestId}-filter-pubkey-index`}
    >
      <Option value="all">all</Option>
      {statuses.map((status) => (
        <Option key={status} value={status}>
          {status}
        </Option>
      ))}
    </Select>
  );
};
