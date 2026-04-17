import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { PlaceholderContainer } from './styles';

type TablePlaceholderProps = {
  isError?: boolean;
};

const { title, description, errorDescription } =
  vaultTexts.actions.validators.table.placeholder;

export const TablePlaceholder: FC<TablePlaceholderProps> = ({ isError }) => {
  return (
    <PlaceholderContainer>
      <Text size="sm" strong>
        {title}
      </Text>
      <Text size="xxs" color="secondary">
        {isError ? errorDescription : description}
      </Text>
    </PlaceholderContainer>
  );
};
