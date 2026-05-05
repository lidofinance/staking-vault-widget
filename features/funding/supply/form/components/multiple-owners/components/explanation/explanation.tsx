import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { Description, List } from './styles';

const { title, list } =
  vaultTexts.actions.supply.banners.multipleOwners.explanation;

export const Explanation = () => {
  return (
    <div>
      <Text size="xxs">{title}</Text>
      <List>
        {list.map((definition) => (
          <Description key={definition}>{definition}</Description>
        ))}
      </List>
    </div>
  );
};
