import { FC, useId } from 'react';

import { Text } from '@lidofinance/lido-ui';

import type { FormulaItem } from 'features/overview/inner';
import { useVaultOverview } from '../../vault-overview';

import { FormulaWrapper, Variable } from './styles';

type FormulaProps = {
  list: FormulaItem[];
  dataTestId?: string;
};

export const Formula: FC<FormulaProps> = ({ list, dataTestId }) => {
  const uniqKey = useId();
  const { values } = useVaultOverview();

  if (!values) return null;

  return (
    <FormulaWrapper data-testid={dataTestId}>
      {list.map((item, index) => {
        const viewData = (
          item.vaultIndicator ? values[item.vaultIndicator] : item.label
        ) as string;

        if (item.hasHighlight)
          return (
            <Variable key={`${uniqKey}-${index}-${item.label}`} variant="gray">
              {viewData}
            </Variable>
          );
        return (
          <Text key={`${uniqKey}-${index}-${item.label}`} size="xxs">
            {viewData}
          </Text>
        );
      })}
    </FormulaWrapper>
  );
};
