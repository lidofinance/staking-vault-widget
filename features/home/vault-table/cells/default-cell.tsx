import { BaseCellProps } from './types';

export const DefaultCell = ({ value }: BaseCellProps) => {
  if (typeof value === 'object' && value !== null) {
    return <>{JSON.stringify(value)}</>;
  }

  return <>{value}</>;
};
