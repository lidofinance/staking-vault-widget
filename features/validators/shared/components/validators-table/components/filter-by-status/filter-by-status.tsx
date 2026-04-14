import { type FC, useMemo, useCallback } from 'react';
import { Option } from '@lidofinance/lido-ui';

import { ValidatorStatus } from 'modules/vaults';

import { useValidators } from 'features/validators/contexts';

import { OptionStyled, SelectStyled } from './styles';

type FilterByStatusProps = {
  dataTestId: string;
};

export const FilterByStatus: FC<FilterByStatusProps> = ({ dataTestId }) => {
  const { meta, setFilterByStatus, params } = useValidators();

  const statuses = useMemo(
    () => Object.keys(meta?.byStatus ?? {}) as ValidatorStatus[],
    [meta?.byStatus],
  );

  const onChange = useCallback(
    (option: string | number) => {
      return setFilterByStatus(option as ValidatorStatus);
    },
    [setFilterByStatus],
  );

  return (
    <SelectStyled
      onChange={onChange}
      placeholder="Status"
      value={params.status}
      data-testid={`${dataTestId}-filter-pubkey-index`}
    >
      <Option value="all">all</Option>
      {statuses.map((status) => (
        <OptionStyled key={status} value={status} $status={status}>
          {status}
        </OptionStyled>
      ))}
    </SelectStyled>
  );
};
