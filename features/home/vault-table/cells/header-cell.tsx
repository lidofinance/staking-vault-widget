import type { FC } from 'react';

import { Hint } from 'shared/components';

export type HeaderCellProps = {
  title: string;
  hint?: string;
};

export const HeaderCell: FC<HeaderCellProps> = ({ title, hint }) => {
  return (
    <>
      {title}
      {hint && <Hint text={hint} />}
    </>
  );
};
