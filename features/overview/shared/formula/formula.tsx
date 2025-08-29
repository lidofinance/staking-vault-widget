import { FC, useId } from 'react';

import { Text } from '@lidofinance/lido-ui';

import type { FormulaItem } from 'features/overview/inner';

import { FormulaWrapper, Variable } from './styles';

type FormulaProps = {
  list: FormulaItem[];
  dataTestId?: string;
};

export const Formula: FC<FormulaProps> = ({ list, dataTestId }) => {
  const uniqKey = useId();

  return (
    <FormulaWrapper data-testid={dataTestId}>
      {list.map((item, index) => {
        if (item.hasHighlight)
          return (
            <Variable key={`${uniqKey}-${index}-${item.label}`} variant="gray">
              {item.label}
            </Variable>
          );
        return (
          <Text key={`${uniqKey}-${index}-${item.label}`} size="xxs">
            {item.label}
          </Text>
        );
      })}
    </FormulaWrapper>
  );
};
