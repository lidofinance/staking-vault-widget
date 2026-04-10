import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { PlaceholderContainer } from './styles';

const { title, description } = vaultTexts.actions.validators.table.placeholder;

export const TablePlaceholder = () => {
  return (
    <PlaceholderContainer>
      <Text size="sm" strong>
        {title}
      </Text>
      <Text size="xxs" color="secondary">
        {description}
      </Text>
    </PlaceholderContainer>
  );
};
