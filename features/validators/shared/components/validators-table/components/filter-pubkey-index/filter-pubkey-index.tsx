import type { FC } from 'react';
import { Input } from '@lidofinance/lido-ui';

import { ReactComponent as SearchIcon } from 'assets/icons/search.svg';

type FilterPubkeyIndexProps = {
  dataTestId: string;
};

export const FilterPubkeyIndex: FC<FilterPubkeyIndexProps> = ({
  dataTestId,
}) => {
  return (
    <Input
      placeholder="Search by index or public key"
      leftDecorator={<SearchIcon />}
      data-testid={`${dataTestId}-filter-pubkey-index`}
      fullwidth
    />
  );
};
