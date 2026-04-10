import type { FC } from 'react';

import { Select, Option } from '@lidofinance/lido-ui';

import { VALIDATOR_STATUSES } from 'modules/vaults';

type FilterByStatusProps = {
  dataTestId: string;
};

const optionsList = Object.values(VALIDATOR_STATUSES);

export const FilterByStatus: FC<FilterByStatusProps> = ({ dataTestId }) => {
  // TODO: move text to vaultTexts
  return (
    <Select
      onChange={function noRefCheck() {}}
      placeholder="Status"
      value={undefined}
      data-testid={`${dataTestId}-filter-pubkey-index`}
    >
      {optionsList.map((status) => (
        <Option key={status} value={status}>
          {status}
        </Option>
      ))}
    </Select>
  );
};
