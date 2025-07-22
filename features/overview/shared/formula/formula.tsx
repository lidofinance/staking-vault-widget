import { FC } from 'react';

import { Text } from '@lidofinance/lido-ui';

import type { FormulaItem } from 'features/overview/inner';

import { FormulaWrapper, Variable } from './styles';

type FormulaProps = {
  list: FormulaItem[];
};

export const Formula: FC<FormulaProps> = ({ list }) => {
  return (
    <FormulaWrapper>
      {list.map((item) => {
        if (item.hasHighlight)
          return (
            <Variable key={item.label} variant="gray">
              {item.label}
            </Variable>
          );
        return (
          <Text key={item.label} size="xxs">
            {item.label}
          </Text>
        );
      })}
    </FormulaWrapper>
  );
};
