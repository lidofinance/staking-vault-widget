import { FC } from 'react';

import { BaseCellProps } from '../types';

export const DefaultCell: FC<BaseCellProps> = ({ value }) => {
  if (typeof value === 'object' && value !== null) {
    return <>{JSON.stringify(value)}</>;
  }

  return <>{value}</>;
};
