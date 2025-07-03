import { Text, Button } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { Card, List, Title } from './styles';

const { connectVault } = vaultTexts.metrics;

export const ConnectVault = () => {
  return (
    <Card>
      <Title as="h2" color="text">
        {connectVault.title}
      </Title>
      <Text size="xs">{connectVault.description}</Text>
      <div>
        <Text size="xs">{connectVault.listTitle}</Text>
        <List>
          {connectVault.list.map((text) => (
            <ol key={text}>
              <Text size="xs">{text}</Text>
            </ol>
          ))}
        </List>
      </div>
      <Button size="sm" onClick={() => {}}>
        {connectVault.action}
      </Button>
    </Card>
  );
};
