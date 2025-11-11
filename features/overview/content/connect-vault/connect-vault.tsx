import { Text, Button } from '@lidofinance/lido-ui';

import { useVault, vaultTexts } from 'modules/vaults';

import { useVaultOverviewData } from 'features/overview/hooks';

import { List, Title, Wrapper } from './styles';

const { connectVault } = vaultTexts.metrics;

export const ConnectVault = () => {
  const { activeVault } = useVault();
  const { isLoading } = useVaultOverviewData();
  const { isVaultDisconnected, isVaultConnected } = activeVault ?? {};

  if (!activeVault || isVaultDisconnected || isVaultConnected || isLoading) {
    return null;
  }

  return (
    <Wrapper>
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
    </Wrapper>
  );
};
