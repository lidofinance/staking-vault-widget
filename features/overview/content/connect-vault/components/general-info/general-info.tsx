import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { GeneralInfoContainer, List, ListWrapper } from './styles';

const { connectVault } = vaultTexts.metrics;

export const GeneralInfo = () => {
  return (
    <GeneralInfoContainer>
      <Text size="xs">{connectVault.description}</Text>
      <ListWrapper>
        <Text size="xs">{connectVault.listTitle}</Text>
        <List>
          {connectVault.list.map((text) => (
            <Text key={text} size="xs">
              {text}
            </Text>
          ))}
        </List>
      </ListWrapper>
    </GeneralInfoContainer>
  );
};
