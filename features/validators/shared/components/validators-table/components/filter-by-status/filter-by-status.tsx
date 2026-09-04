import { type FC, useMemo, useCallback } from 'react';
import { Option } from '@lidofinance/lido-ui';

import { type ValidatorStatus } from 'modules/vaults';

import { useValidators } from 'features/validators/contexts';
import { getTextForStatus } from 'features/validators/utils';

import { OptionStyled, SelectStyled } from './styles';

export const FilterByStatus: FC = () => {
  const { meta, setFilterByStatus, params } = useValidators();

  const statuses = useMemo(
    () => Object.keys(meta?.byStatus ?? {}) as ValidatorStatus[],
    [meta?.byStatus],
  );

  const onChange = useCallback(
    (option: string | number) => {
      return setFilterByStatus(
        option === 'all' ? undefined : (option as ValidatorStatus),
      );
    },
    [setFilterByStatus],
  );

  return (
    <SelectStyled
      onChange={onChange}
      placeholder="Status"
      $status={params.status}
      value={params.status ?? 'all'}
      data-testid="filter-status"
    >
      <Option value="all">all</Option>
      {/* the value stays the API status: the backend knows nothing about the
          `deposited` / `pre_deposited` view statuses */}
      {statuses.map((status) => (
        <OptionStyled key={status} value={status} $status={status}>
          {getTextForStatus(status)}
        </OptionStyled>
      ))}
    </SelectStyled>
  );
};
