import { formatPercent } from 'utils/format-number';

import { BaseCellProps } from './types';

export const PercentCell = (props: BaseCellProps): JSX.Element => {
  const { value, children } = props;
  const content = children ?? value;
  const percent = formatPercent.format(content as number);

  return <>{percent}</>;
};
