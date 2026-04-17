import type { FC } from 'react';
import { Close, Input } from '@lidofinance/lido-ui';

import { ReactComponent as SearchIcon } from 'assets/icons/search.svg';

import { useFilterPubkeyIndex } from './use-filter-pubkey-index';

type FilterPubkeyIndexProps = {
  dataTestId: string;
};

export const FilterPubkeyIndex: FC<FilterPubkeyIndexProps> = ({
  dataTestId,
}) => {
  const { value, error, handleChange, handleClear } = useFilterPubkeyIndex();

  return (
    <Input
      value={value}
      onChange={handleChange}
      placeholder="Search by index or public key"
      leftDecorator={<SearchIcon />}
      rightDecorator={
        value ? (
          <Close
            aria-label="Clear validator filter"
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClear}
            style={{ cursor: 'pointer' }}
          />
        ) : null
      }
      error={error}
      data-testid={`${dataTestId}-filter-pubkey-index`}
      fullwidth
    />
  );
};
