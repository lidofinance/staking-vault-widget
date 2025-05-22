import { FC } from 'react';

import { Hint } from 'shared/components';
import { ArrowAnimated } from './styles';

type SortDirection = 'asc' | 'desc';

export type HeaderCellProps = {
  title: string;
  hint?: string;
  onSort?: (dir: SortDirection) => void;
  sortDirection?: SortDirection;
};

export const HeaderCell: FC<HeaderCellProps> = ({
  title,
  hint,
  onSort,
  sortDirection,
}) => {
  const showSort = !!(onSort && sortDirection);
  return (
    <>
      {title}
      {hint && <Hint text={hint} />}
      {showSort && <ArrowAnimated direction={sortDirection} />}
    </>
  );
};
